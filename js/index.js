//Check out http://www.graphdracula.net/ for a network graph that might pair well with the way data is stored
//Use http://visjs.org/network_examples.html for a more feature rich one.

var termFilter="16/WI";
var degreeFilter="CS";
var debug=true;

//Will need a object to hold data in a usable format
var ClassInfo = function (classData) { //Pass in the course
    this.name=classData.prefix+classData.courseNumber;      //Holds the class id CS255
    this.longName=classData.title;                          //Holds the name of the course such as "Front end web development"
    this.desc=classData.description;                        //Holds a description of the course
    this.credits=classData.credit;                          //Number of credits the course is worth
    this.room=classData.meetingTimes[0].room;               //Room the course is in
    this.days=s.chars(classData.meetingTimes[0].days);      //Days of the week. Should only contian U,M,T,W,R,F,S
    this.startTime=classData.meetingTimes[0].startTime;     //Start time of the course as a string
    this.endTime=classData.meetingTimes[0].endTime;         //end time of the course as a string
    this.instructor=classData.instructors;                  //Who teaches the class
    this.priority=0;                                        //0 is the lowest priority
    this.prereqs=[];                                        //Array of prereq's. One for each required class.
};

var Degree = function(otherDegrees) {
    this.nodes=new vis.DataSet();
    this.edges=new vis.DataSet();

    this.required=[];
    this.electives=[];
    this.electiveCredit=0;

    this.reqs={};
    this.concurrent={};
    this.priorityList={};
    this.equivalent = {}
    this.otherDegrees=otherDegrees;

    this.addRequired=function addRequired(classNames) {
        this.required.push(classNames);
        var that=this;
        $.each(classNames,function(index,value) {
            that.nodes.add([{
                id: value,
                label: value
            }]);
        });
    };


    this.addElective=function addElective(classNames) {
        this.electives.push(classNames);
    };

    this.addPreReq = function addReq(course, arrReqs) {
        this.reqs[course]=this.reqs[course] || []; //Init it if we haven't already
        this.reqs[course].push(arrReqs);
        var that=this;
        $.each(arrReqs,function(index,value) {
            that.edges.add([{
                from: value,
                to: course,
                arrows:'to'
            }]);
        });
    };

    this.addConcurrent = function addConcurrent(course, arrReqs) {
        this.concurrent[course]=this.concurrent[course] || []; //Init it if we haven't already
        this.concurrent[course].push(arrReqs);
    };

    this.setEquivalent = function setEquivalent (course,arrCourses) { //arrCourses are equivilent courses
        this.equivalent[course]=arrCourses;
    }

    this.isEquivalent = function isEquivalent(course,course2) {
        return !(_.indexOf(this.equivalent[course],course2)===-1);
    }

    this.getGraphData = function getGraphData() {
        return {
            nodes: this.nodes,
            edges: this.edges
        };
    };

    this.getClassList = function getClassList() {
        var cl = _.flatten(_.union(_.flatten(this.required), _.flatten(this.electives),
            _.keys(this.reqs),_.flatten(_.map(this.reqs, _.values)),
            _.keys(this.concurrent),_.flatten(_.map(this.concurrent, _.values))
        ));
        return cl;
    };

    this.getDeptList = function getDeptList() {
        var re = /[A-Z]*/;
        var strs = this.getClassList();
        var m;
        var deptList=[];
        $.each(strs,function(index,str) {
            if ((m = re.exec(str)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                deptList.push(m[0]);
            }
        });
        return _.uniq(deptList);
    };

    this.calcPriorityAll = function calcPriorityAll() {
        //List of everything that is a prereq
        var isPreReq  = _.union(_.keys(this.reqs), _.keys(this.concurrent));
        var cl = this.getClassList();
        //Init prioritylist
        var that=this;

        $.each(cl,function(index,value) {
            that.priorityList[value] = 0;
        });

        $.each(cl,function(indx,node) {
            that.updatePriority(node);
        });
    };

    this.updatePriority = function updatePriority(node) {
        var that=this;
        if (typeof that.reqs[node] === 'undefined') { //I have no prereqs so I am a value 1 node
            return 1;
        }
        $.each(that.reqs[node],function (index,reqsArr) {
            $.each(reqsArr,function (index,reqClass) {
                if (typeof that.required[reqClass]!== 'undefined')
                    that.priorityList[reqClass] += 1; //Add an extra bit to classes that are required for our major
                that.priorityList[reqClass] += 1;
                that.updatePriority(reqClass);
            });
        }) ;
    };

    this.canTake = function (node,classes) { // node is the class you want to take, classes is what you have already taken in an array
        var ok = true;
        var re = /([A-Z]{2,4})(\d{3})/;
        var dept = re.exec(node)[1];
        debugPrint("canTake dept",dept);
        if (typeof otherDegrees[dept] === 'undefined') //We don't have any degree info, so no prereqs
            return true;
        if (typeof otherDegrees[dept].reqs[node] === 'undefined') //We have no prereqs
            return true;

        $.each(otherDegrees[dept].reqs[node],function(key,value) {
            //Value will now be an array of prereqs, we need one of each. If this fails then return false, we don't have
            //what we need.
            if (_.intersection(classes,value).length===0) { //We are missing a req
                ok=false;
                return false; //Breaks out of our each loop
            }
        });
        return ok;
    };
};

//Array of promises to know when both the data has loaded and that the dom is ready.
var siteReady=[];
//Array of promises for each DAL script we need to load
var scriptsReady=[];
//Promise when our page is ready
var domReady = $.Deferred();
//holds our raw course data
var courses={};
//holds our formated course data
var classList = {};
//Required classes
var degreeInfo={};

//Wait until the dom is read.
siteReady.push(domReady.promise());

var app=function () {

};

$(document).ready(function() {domReady.resolve();});
//start our main app. This should get the page ready and then call main() once everything is setup
init();

//Our init function should make sure all the data is ready and the dom is loaded
function init()
{
    //Bind our click handler for expanding out
    /*$('.classHeaderExpand').click(function(){
        alert("I was clicked");
        $('.classContentExpand').slideToggle('slow');
    });*/

    //Fetch the data for CS. This will run the CS.js file
    //This way we have all the degree data for CS in one file and if it ever becomes
    //available to parse instead of manually update we can just edit that file to return the data
    //in the format needed.
    var arrDalsToLoad = ["CS","CIS"];
        $.each(arrDalsToLoad,function(index,fileName) {
            scriptsReady.push($.getScript("./js/dal/" + fileName + ".js").done(function () {

                }).fail(function () {
                    if (arguments[0].readyState == 0) {
                        console.error("Script "+ fileName +" failed to load");
                    } else {
                        //script loaded but failed to parse
                        console.error("Script "+ fileName +" failed to load due to script error");
                        console.error(arguments[2].toString());
                    }
                })
            )});

    $.when.apply(null, scriptsReady).then(function() {
        degreeInfo[degreeFilter].calcPriorityAll();
        siteReady.push(getData().done(function () {
            //Set our button from loading to check
            //$("#runButton").text("Run");
        }));
        $.when.apply(null, siteReady).then(main);
    });
}
//Our data is loaded and our dom is loaded. Process the data and bind our events.
function main() {
    $("#loading-overlay").hide();
    console.log("Page is ready");
    //console.log(courses);
    var depts=["CS","CIS"];
    $.each(depts,function(indx,deptName){
        var dept=courses[deptName];

        //Loop though each course in CS and make our psudo
        $.each(dept,function (i,classData) {
            if (classData.term !== termFilter)
                return true; //Same as continue
            var classInfo = new ClassInfo(classData);
            //Work around because !== " " was always true for some reason
            if ($.trim(classData.prerequisites) != '') {
                if (typeof degreeInfo[deptName] !== 'undefined') {
                    if (_.has(degreeInfo[deptName].reqs, classInfo.name)) {
                        classInfo.prereqs = degreeInfo[deptName].reqs[classInfo.name];
                    }
                }
            }
            //Store our class
            classList[classInfo.name]=classList[classInfo.name]||[];
            classList[classInfo.name].push(classInfo);
        });
    })

    //Fill in our checkbox list
    var checkTemplate=_.template('<label class="checkbox-inline no_indent"><input type="checkbox" class="checkbox-classList classContentExpand" value="<%=name%>"> <%=name%></label>');
    var sortedClassList = _.sortBy(degreeInfo[degreeFilter].getClassList(),function (name) {return name});
    var lastDept="";
    var first=true;
    var html='';
    $.each(sortedClassList,function (index,value) {
        var re = /([A-Z]{2,4})(\d{3})/;
        var deptName = re.exec(value)[1];
        if (deptName !== lastDept){
            if (!first) {
                html+="</div>";
            }
            first=false;
            html+='<h5>'+deptName+'</h5><div>';
            lastDept=deptName;
        }
        html += checkTemplate({name: value});

    });
    $("#classList").append(html+'</div>');
    $("#classList").accordion();
    //Draw our graph
    var container = $("#courseChart")[0];
    var options = {
        layout: {
            hierarchical: {
                direction: 'LR',
                sortMethod: 'directed'
            }
        }
    };
    var network = new vis.Network(container, degreeInfo[degreeFilter].getGraphData(), options);
    console.log(degreeInfo["CS"]);
}

function calcSchedule() {
    //Make an array of what we have taken
    var classesTaken = $('.checkbox-classList:checked').map(function () {
        return this.value;
    }).get();
    //Add in equivelent classes as classes taken
    $.each(classesTaken,function (index,value) {
        classesTaken = _.union(classesTaken,degreeInfo[degreeFilter].equivalent[value]);
    })
    //Sort it by name
    classesTaken=_.sortBy(classesTaken,function (name) {return name});
    //Sort classes by priority
    debugPrint("Priority list",degreeInfo[degreeFilter].priorityList);
    var classPriority = _.map(degreeInfo[degreeFilter].priorityList, function(val,key) {
        return {name:key,priority:val};
    });
    classPriority= _.sortBy(classPriority,'priority').reverse();

    //Select classes until I hit max credit. Classes should not be selected if it conflicts with an already scheduled class
    //or I have already taken it
    var toTake=[];
    var canTake=[];
    var creditsTaken=0;
    debugPrint("classes taken so far",classesTaken);
    $.each(classPriority,function(index,value) {

        var classData = classList[value.name];
        if (_.indexOf(classesTaken,value.name,true) ===-1) { //select it only if we haven't already taken it
            debugPrint("Can I take " + value.name ,degreeInfo['CS'].canTake(value.name,classesTaken));
            if (degreeInfo[degreeFilter].canTake(value.name,classesTaken)) {
                if (typeof classList[value.name] === 'undefined' ) { //Not offered
                    debugPrint("Class not offered "+value.name);
                    canTake.push(value.name);
                    return true; //Class isn't offered so we skip it.
                } else {
                    debugPrint("Taking ", classData[0]);
                    toTake.push(value.name);
                    canTake.push(value.name);
                    creditsTaken += parseInt(classData[0].credits);
                    debugPrint("Credits taken ", creditsTaken);
                    if (creditsTaken >= 16) {
                        debugPrint("Taken all we can");
                        return false;
                    }
                }
            }
        }
    });
    debugPrint("Take: ",linkedCourseArray(toTake));
    $("#classToTake").append(linkedCourseArray(toTake));
    $("#classCanTake").text(canTake);
}

//Pull down our data one department at a time
//If we pull it down all at once it gets truncated.
function getData() {
    var myPromise = $.Deferred();
    var getPromise=[];
    //List of dept prefixes
    //var depts = ["ACCT", "ART", "BIOL", "BL", "BLS", "CBM", "CDM", "CHEM", "CIS", "CJ", "CMA", "COMM", "CS", "ECE", "ECON", "EDL", "ELP", "ENGL", "ETD", "ETM", "FIN", "FREN", "GEOG", "GER", "GS", "HIST", "HON", "HS", "HUM", "JAPN", "KINE", "LAT", "LAW", "LS", "MAS", "MATH", "ME", "MEM", "MFL", "MGT", "MKT", "MLS", "MUS", "MUSE", "NS", "NURS", "OT", "PHE", "PHIL", "PHYS", "PLSH", "PS", "PSYC", "RFS", "RPW", "RS", "SOC", "SPAN", "SW", "TCFL", "TE", "TEMS", "THEA", "YS"];
    //console.log(degreeInfo["CS"].getDeptList());
    var depts=degreeInfo[degreeFilter].getDeptList();
    $("#loading-progressbar").progressbar({
        max: depts.length,
        value: 0
    });
    $("#loading-overlay").show();
    var prog=0;
    $.each(depts, function (index, dept) {
        getPromise.push($.getJSON("https://api.svsu.edu/courses?prefix=" + dept, function (data) {
            courses[dept]=data.courses;
        }).done(function() {
            $("#loading-progressbar").progressbar("option", "value", prog++);
        }));
    });
    $.when.apply(null,getPromise).then(function() {myPromise.resolve();});
    return myPromise.promise(); //return our promise;
}

function linkedCourseArray(arrCourses) {
    var html='';
    var url="http://catalog.svsu.edu/search_advanced.php?search_database=Search&search_db=Search&cpage=1&ecpage=1&ppage=1&spage=1&tpage=1&location=3&filter%5Bexact_match%5D=1&filter%5Bkeyword%5D=";
    var linkTemplate=_.template('<a href="<%=url%><%=name%>" target="_blank"><%=name%></a> ');

    $.each(arrCourses,function(index,value) {
        html+=linkTemplate({url: url,name:value})
    })
    return html;
}

function debugPrint (msg,obj) {
    if (debug) {
        var prefix="D/:";
        if (typeof msg === 'string') {
            if (typeof obj !== 'undefined'){
                console.log(prefix+"=====[ " + msg + " ]=====");
                console.log(obj);
            }
            else{
                console.log(prefix+":" + msg);
            }
        }
        else
        {   console.log(prefix+":");
            console.log(msg);
        }
    }
};
