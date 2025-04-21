package.path = package.path .. ";../lib/?.lua"

local lib = require("lib.utils")
local meta = require("lib.meta")
local json = require("json")
local strings = require("strings")
local alvu = require("alvu")

local function get_parent_path(path)
	local file_sep = "/"
	local t = {}
	for str in string.gmatch(path, "([^" .. file_sep .. "]+)") do
		table.insert(t, str)
	end
	table.remove(t, #t)
	local final = ""
	for k, v in pairs(t) do
		if string.len(final) == 0 then
			final = v
		else
			final = final .. file_sep .. v
		end
	end
	return final
end

local base = "pages/"

function Writer(filedata)
	local data = json.decode(filedata)
	local books = { "surviving-the-madness-of-timezones" }

	local prev_file = ""
	local crossed = false
	local next_file = ""

	for book_i, book in pairs(books) do
		local files = alvu.files(base .. book)
		for file_i, file in pairs(files) do
			if strings.has_suffix(file, ".md") and not string.find(file, "index.md") then
				if base .. book .. "/" .. file == data["source_path"] then
					local parent_path = get_parent_path(data["source_path"])

					if files[file_i - 1] then
						prev_file = parent_path .. "/" .. files[file_i - 1]
					end
					if files[file_i + 1] and not string.find(files[file_i + 1], "index.md") then
						next_file = parent_path .. "/" .. files[file_i + 1]
					end
				end
			end
		end
	end

	local data = {}

	if string.len(prev_file) ~= 0 then
		local meta_details = meta.get_meta_for_file(prev_file)
		data.prev = {
			file = prev_file,
			title = meta_details["title"],
			slug = string.gsub(meta_details["slug"], base, ""),
		}
	end

	if string.len(next_file) ~= 0 then
		local meta_details = meta.get_meta_for_file(next_file)
		data.next = {
			file = next_file,
			title = meta_details["title"],
			slug = string.gsub(meta_details["slug"], base, ""),
		}
	end

	return json.encode({
		data = data,
	})
end
