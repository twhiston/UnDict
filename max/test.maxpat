{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 9,
			"minor" : 1,
			"revision" : 0,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 538.0, 219.0, 1000.0, 780.0 ],
		"gridsize" : [ 15.0, 15.0 ],
		"boxes" : [ 			{
				"box" : 				{
					"code" : "const undict = require(\"undict\")\r\n\r\nconst dict = new Dict(\"testdata\")\r\nconst lush = undict.dictToObject(dict)\r\n\r\npost(JSON.stringify(lush))",
					"filename" : "none",
					"fontface" : 0,
					"fontname" : "<Monospaced>",
					"fontsize" : 12.0,
					"id" : "obj-2",
					"maxclass" : "v8.codebox",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 630.0, 242.0, 340.0, 200.0 ],
					"saved_object_attributes" : 					{
						"parameter_enable" : 0
					}

				}

			}
, 			{
				"box" : 				{
					"code" : "{\n\t\"cringle\": \"crongle\",\r\n\t\"nest\": {\r\n\t\t\"chungus\": 0,\r\n\t\t\"chongus\" : {\r\n\t\t\t\"mingus\": \"dew\",\r\n\t\t\t\"mongus\": \"bongus\"\r\n\t\t}\r\n\t}\n}\n",
					"fontface" : 0,
					"fontname" : "<Monospaced>",
					"fontsize" : 12.0,
					"id" : "obj-1",
					"maxclass" : "dict.codebox",
					"numinlets" : 2,
					"numoutlets" : 5,
					"outlettype" : [ "dictionary", "", "", "", "" ],
					"patching_rect" : [ 268.0, 242.0, 340.0, 200.0 ],
					"saved_object_attributes" : 					{
						"legacy" : 0,
						"name" : "testdata",
						"parameter_enable" : 0,
						"parameter_mappable" : 0
					}

				}

			}
 ],
		"lines" : [  ],
		"dependency_cache" : [ 			{
				"name" : "undict.js",
				"bootpath" : "~/Code/undict/dist",
				"patcherrelativepath" : "../dist",
				"type" : "TEXT",
				"implicit" : 1
			}
 ],
		"autosave" : 0
	}

}
