"use strict";

var levels = {};

levels["level_1"] = "\
b+++++++b\n\
+++++++++\n\
+++++++++\n\
+++++++++\n\
++++e++++\n\
+++++++++\n\
+++++++++\n\
+++++++++\n\
b+++++++b\n\
";

levels["level_2"] = "\
b+++++++b\n\
++++e++++\n\
++++e++++\n\
++++e++++\n\
+++++++++\n\
+++++++++\n\
+++++++++\n\
+++++++++\n\
b+++++++b\n\
";

levels["level_3"] = "\
b+++++++b\n\
+++++++++\n\
+++++++++\n\
++++e++++\n\
++++ve+++\n\
++++e++++\n\
+++++++++\n\
+++++++++\n\
b+++++++b\n\
";

levels["level_4"] = "\
b+++ree+b\n\
++++rve++\n\
++++ree++\n\
+++ire+++\n\
+++++e+++\n\
+++++++++\n\
+++++++++\n\
+++++++++\n\
b+++++++b\n\
";

levels["level_5"] = "\
b+++++++b\n\
+++++++++\n\
+++++++++\n\
++++ie+++\n\
++v++e+++\n\
+++++++++\n\
+++++++++\n\
+++++++++\n\
b+++++++b\n\
";

levels["level_6"]= "\
b+++++++b\n\
+++++++++\n\
+++++++++\n\
++++i++++\n\
+++++i+++\n\
++++e++++\n\
+++++++++\n\
+++++v+++\n\
b+++++++b\n\
";

levels["level_7"]="\
b+++++++b\n\
+++++++++\n\
+++++++++\n\
+++i+ii++\n\
+++i++i++\n\
+++iiii++\n\
+++++++++\n\
+++++++++\n\
b+++++++b\n\
";

levels["level_8"]="\
b+++++++b\n\
+++++++++\n\
++++v++++\n\
++++re+++\n\
+++rrri++\n\
++++re+++\n\
+++++++++\n\
+++++++++\n\
b+++++++b\n\
";

levels["level_9"]="\
brrrrr++++++b\n\
++++v+e++++++\n\
++e++vr++++++\n\
brrrrrrr++++b\n\
";

levels["level_10"]="\
b++++b\n\
+err++\n\
++err+\n\
++iirr\n\
++v++r\n\
++++++\n\
++e+++\n\
+++e++\n\
++e+++\n\
b++++b\n\
";

levels["level_11"]="\
b+++++++++++b\n\
+++++++++++++\n\
++++++++irr++\n\
+++++++vrrr++\n\
+++++++++ir++\n\
++++++v++i+++\n\
b+++++++++++b\n\
";

levels["level_12"]="\
bi++++++b\n\
++++i++r+\n\
+++e+++++\n\
++i+ee+++\n\
++++++i++\n\
b+++++++b\n\
";

levels["level_13"]="\
b++++++++b\n\
++i++e++++\n\
+++++eee++\n\
++eeeerv++\n\
++v++vre++\n\
+++++ere++\n\
b++i+ere+b\n\
";

levels["level_14"]="\
b+++++b\n\
+r++rrr\n\
+++r+i+\n\
++v+v++\n\
+++++++\n\
i++v++i\n\
+r+++r+\n\
beeeeeb\n\
";

levels["level_15"]="\
b+++++++b\n\
+++++e+e+\n\
+++v++v+e\n\
r+++v++++\n\
+rv+ev+++\n\
++r+v++++\n\
b++r+v++b\n\
";


var all_levels = [	{name: "level_1", par: 1},
					{name: "level_2", par: 1},
					{name: "level_3", par: 3},
					{name: "level_4", par: 2},
					{name: "level_5", par: 4},
					{name: "level_6", par: 5},
					{name: "level_7", par: 6}, 
					{name: "level_8", par: 5},
					{name: "level_9", par: 4},
					{name: "level_10", par: 5},
					{name: "level_11", par: 8}, 
					{name: "level_12", par: 5},
					{name: "level_13", par: 8},
					{name: "level_14", par: 11},
					{name: "level_15", par: 13}
				];
