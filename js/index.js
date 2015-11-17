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
    this.hasPrereqs = function (classes) { //Takes an array of classes taken
        var ok = true;
        $.each(this.prereqs,function(key,value) {
            //Value will now be an array of prereqs, we need one of each. If this fails then return false, we don't have
            //what we need.
            if (_.intersection(classes,value).length===0) { //We are missing a req
                ok=false;
                return false; //Breaks out of our each loop
            }
        });
        return ok;
    }

}

var prereq = function (arr) {
    this.rec = arr; //this array will hold equivalent classes. If you needed either MATH 120a or MATH 120b then it would hold ["MATH120a","MATH120b"]
}

//Array of promises to know when both the data has loaded and that the dom is ready.
var siteReady=[];
//Promise when our page is ready
var domReady = $.Deferred();
//holds our raw course data
var courses={};

//array to hold all our prereq data. Right now this has to be manualy built until a good parsing system can be built
var reqs={};
reqs["CS116"]=[];
reqs["CS116"].push(new prereq("MATH103","MATH120A","MATH120B","MATH140","MATH161"));
reqs["CS116"].push(new prereq("CS105","CS107"));

reqs["CS216"]=[];
reqs["CS216"].push(new prereq("MATH120A","MATH120B","MATH140","MATH161"));
reqs["CS216"].push(new prereq("CS116"));

reqs["CS245"]=[];
reqs["CS245"].push(new prereq("MATH120B","MATH140","MATH161"));
reqs["CS216"].push(new prereq("CS116"));

siteReady.push(domReady.promise());

var app=function () {

}

$(document).ready(function() {domReady.resolve();});
//start our main app. This should get the page ready and then call main() once everything is setup
init();

//Our init function should make sure all the data is ready and the dom is loaded
function init()
{
    siteReady.push(getData().done(function () {
        //Set our button from loading to check
        //$("#runButton").text("Run");
    }));
    $.when.apply(null,siteReady).then(main);
}
//Our data is loaded and our dom is loaded. Process the data and bind our events.
function main() {
    $("#loading-overlay").hide();
    console.log("Page is ready");
    //console.log(courses);
    var dept=courses["CS"];
    var classList = {};
    //Loop though each course in CS and make our psudo
    $.each(dept,function (i,classData) {
        var classInfo = new ClassInfo(classData);
        //Work around because !== " " was always true for some reason
        if ($.trim(classData.prerequisites) != '') {
            if (_.has(reqs,classInfo.name))
                classInfo.prereqs=reqs[classInfo.name];
            //console.log(classInfo);
        }
        //Store our class
        classList[classInfo.name]=classInfo;
    });
    /* example of checking for prereq
    console.log(classList);
    console.log(classList["CS116"].hasPrereqs(["MATH103","CS105"]));
    console.log(classList["CS116"].hasPrereqs(["CS105"]));
    console.log(classList["CS101"].hasPrereqs(["CS105"]));
    */
}

//Pull down our data one department at a time
//If we pull it down all at once it gets truncated.
function getData() {
    var myPromise = $.Deferred();
    var getPromise=[];
    //List of dept prefixes
    var depts = ["ACCT", "ART", "BIOL", "BL", "BLS", "CBM", "CDM", "CHEM", "CIS", "CJ", "CMA", "COMM", "CS", "ECE", "ECON", "EDL", "ELP", "ENGL", "ETD", "ETM", "FIN", "FREN", "GEOG", "GER", "GS", "HIST", "HON", "HS", "HUM", "JAPN", "KINE", "LAT", "LAW", "LS", "MAS", "MATH", "ME", "MEM", "MFL", "MGT", "MKT", "MLS", "MUS", "MUSE", "NS", "NURS", "OT", "PHE", "PHIL", "PHYS", "PLSH", "PS", "PSYC", "RFS", "RPW", "RS", "SOC", "SPAN", "SW", "TCFL", "TE", "TEMS", "THEA", "YS"];
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

