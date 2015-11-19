/**
 * Created by Brian Cobb on 11/17/2015.
 */
//Check out http://catalog.svsu.edu/search_advanced.php?cur_cat_oid=24&search_database=Search&search_db=Search&cpage=1&ecpage=1&ppage=1&spage=1&tpage=1&location=3&filter%5Bkeyword%5D=cis311&filter%5Bexact_match%5D=1
//to see if we can't some how pull this data programmatically.
degreeInfo["CS"]=new Degree(degreeInfo);
degreeInfo["CS"].setEquivalent("MATH140",["MATH120A","MATH120B"]);
degreeInfo["CS"].setEquivalent("MATH161",["MATH140","MATH120A","MATH120B"]);
degreeInfo["CS"].setEquivalent("CS105",["CS107"]);
degreeInfo["CS"].setEquivalent("CS107",["CS105"]);

//Format is the same. each entry in required is required. if the entry in required is an array, any of those fill that requirment.
degreeInfo["CS"].addRequired(["MATH140"]);
degreeInfo["CS"].addRequired(["MATH161"]);
degreeInfo["CS"].addRequired(["MATH223"]);
degreeInfo["CS"].addRequired(["MATH300"]);
degreeInfo["CS"].addRequired(["COMM105A"]);
degreeInfo["CS"].addRequired(["ENGL304"]);
degreeInfo["CS"].addRequired(["PHIL205A","PHIL210B"]);
degreeInfo["CS"].addRequired(["CS105","CS107"]);
degreeInfo["CS"].addRequired(["CS116"]);
degreeInfo["CS"].addRequired(["CS146"]);
degreeInfo["CS"].addRequired(["CS216"]);
degreeInfo["CS"].addRequired(["CS245"]);
degreeInfo["CS"].addRequired(["CIS255"]);
degreeInfo["CS"].addRequired(["CIS311"]);
degreeInfo["CS"].addRequired(["CS316"]);
degreeInfo["CS"].addRequired(["CS331"]);
degreeInfo["CS"].addRequired(["CIS355"]);

degreeInfo["CS"].addRequired(["CIS366"]);
degreeInfo["CS"].addRequired(["CS401"]);
degreeInfo["CS"].addRequired(["CS411"]);
degreeInfo["CS"].addRequired(["CS421"]);
degreeInfo["CS"].addRequired(["CS446"]);
degreeInfo["CS"].addRequired(["CS451"]);

degreeInfo["CS"].electiveCredit=8;
degreeInfo["CS"].addElective(["CS402"]);
degreeInfo["CS"].addElective(["CS403"]);
degreeInfo["CS"].addElective(["CS416"]);
degreeInfo["CS"].addElective(["CS422"]);
degreeInfo["CS"].addElective(["CS431"]);
degreeInfo["CS"].addElective(["CS476"]);
degreeInfo["CS"].addElective(["CS482"]);
degreeInfo["CS"].addElective(["CS490"]);

//Each add is an or condition. So this must have MATH103 OR MATH120A OR MATH120B ...
degreeInfo["CS"].addPreReq("CS116",["MATH103","MATH120A","MATH120B"]);
//Doing a second add makes it an AND condition. So it must also have one of the following courses.
degreeInfo["CS"].addPreReq("CS116",["CS105","CS107"]);

//Add in math prereqs
degreeInfo["CS"].addPreReq("MATH300",["MATH161"]);
degreeInfo["CS"].addPreReq("MATH161",["MATH140"]);
degreeInfo["CS"].addPreReq("MATH140",["MATH120A","MATH120B"]);

degreeInfo["CS"].addPreReq("CS216",["MATH120A","MATH120B","MATH140","MATH161"]);
degreeInfo["CS"].addPreReq("CS216",["CS116"]);

degreeInfo["CS"].addPreReq("CS245",["MATH120B","MATH140","MATH161"]);
degreeInfo["CS"].addPreReq("CS245",["CS116"]);

degreeInfo["CS"].addPreReq("CS316",["CS216"]);
degreeInfo["CS"].addConcurrent("CS316",["MATH300"]);

degreeInfo["CS"].addPreReq("CS331",["CS216"]);

degreeInfo["CS"].addPreReq("CS333",["CS216"]);
degreeInfo["CS"].addPreReq("CS333",["CJ201"]);

degreeInfo["CS"].addPreReq("CS345",["CS216"]);

degreeInfo["CS"].addPreReq("CS401",["CS331"]);

degreeInfo["CS"].addPreReq("CS403",["CIS355"]);
degreeInfo["CS"].addPreReq("CS403",["CS401","CIS301"]);

degreeInfo["CS"].addPreReq("CS411",["CS216"]);

degreeInfo["CS"].addPreReq("CS421",["CIS355"]);
degreeInfo["CS"].addPreReq("CS421",["CIS357"]);
degreeInfo["CS"].addPreReq("CS421",["CIS401"]);
degreeInfo["CS"].addPreReq("CS421",["CIS411"]);

degreeInfo["CS"].addPreReq("CS433",["CS333"]);

degreeInfo["CS"].addPreReq("CS446",["CIS331"]);

degreeInfo["CS"].addPreReq("CS451",["CS316"]);

degreeInfo["CS"].addPreReq("CS471",["CS421"]);

degreeInfo["CS"].addPreReq("CS357",["CS216"]);