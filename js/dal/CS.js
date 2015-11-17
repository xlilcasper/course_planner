/**
 * Created by Brian Cobb on 11/17/2015.
 */
degreeInfo["CS"]=new Degree();

//Format is the same. each entry in required is required. if the entry in required is an array, any of those fill that requirment.
degreeInfo["CS"].required.push(["MATH161"]);
degreeInfo["CS"].required.push(["MATH300"]);
degreeInfo["CS"].required.push(["COMM105A"]);
degreeInfo["CS"].required.push(["ENGL304"]);
degreeInfo["CS"].required.push(["PHIL205A","PHIL210B"]);
degreeInfo["CS"].required.push(["CS105","CS107"]);
degreeInfo["CS"].required.push(["CS116"]);
degreeInfo["CS"].required.push(["CS146"]);
degreeInfo["CS"].required.push(["CS216"]);
degreeInfo["CS"].required.push(["CIS255"]);
degreeInfo["CS"].required.push(["CIS311"]);
degreeInfo["CS"].required.push(["CS316"]);
degreeInfo["CS"].required.push(["CS331"]);
degreeInfo["CS"].required.push(["CIS355"]);

degreeInfo["CS"].electiveCredit=8;
degreeInfo["CS"].electives.push(["CS402"]);
degreeInfo["CS"].electives.push(["CS416"]);
degreeInfo["CS"].electives.push(["CS422"]);
degreeInfo["CS"].electives.push(["CS431"]);
degreeInfo["CS"].electives.push(["CS476"]);
degreeInfo["CS"].electives.push(["CS482"]);
degreeInfo["CS"].electives.push(["CS490"]);

//array to hold all our prereq data. Right now this has to be manually built until a good parsing system can be built

//Each add is an or condition. So this must have MATH103 OR MATH120A OR MATH120B ...
degreeInfo["CS"].addReq("CS116",["MATH103","MATH120A","MATH120B","MATH140","MATH161"]);
//Doing a second add makes it an AND condition. So it must also have one of the following courses.
degreeInfo["CS"].addReq("CS116",["CS105","CS107");

degreeInfo["CS"].addReq("CS216",["MATH120A","MATH120B","MATH140","MATH161"]);
degreeInfo["CS"].addReq("CS216",["CS116"]);

degreeInfo["CS"].addReq("CS245",["MATH120B","MATH140","MATH161"]);
degreeInfo["CS"].addReq("CS245",["CS116"]);

degreeInfo["CS"].addReq("CS316",["CS216"]);
degreeInfo["CS"].addConcurrent("CS316",["MATH300"]);

degreeInfo["CS"].addReq("CS331",["CS216"]);

degreeInfo["CS"].addReq("CS333",["CS216"]);
degreeInfo["CS"].addReq("CS333",["CJ201"]);

degreeInfo["CS"].addReq("CS345",["CS216"]);

degreeInfo["CS"].addReq("CS401",["CS331"]);

degreeInfo["CS"].addReq("CS403",["CIS355"]);
degreeInfo["CS"].addReq("CS403",["CS401","CIS301"]);

degreeInfo["CS"].addReq("CS411",["CS216"]);

degreeInfo["CS"].addReq("CS421",["CIS355"]);
degreeInfo["CS"].addReq("CS421",["CIS357"]);
degreeInfo["CS"].addReq("CS421",["CIS401"]);
degreeInfo["CS"].addReq("CS421",["CIS411"]);

degreeInfo["CS"].addReq("CS433",["CS333"]);

degreeInfo["CS"].addReq("CS446",["CIS331"]);

degreeInfo["CS"].addReq("CS451",["CS316"]);

degreeInfo["CS"].addReq("CS471",["CS421"]);



