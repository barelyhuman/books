package.path = package.path .. ";../lib/?.lua"

local lib = require("lib.utils")
local meta = require("lib.meta")
local json = require("json")
local alvu = require("alvu")

ForFile = "surviving-the-madness-of-timezones/index.md"
local basePath = "pages/surviving-the-madness-of-timezones"

function Writer(filedata)
	return json.encode({
		data = {
			content = meta.get_meta_for_path(basePath),
		},
	})
end
