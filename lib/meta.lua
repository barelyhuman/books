local alvu = require("alvu")
local strings = require("strings")
local yaml = require("yaml")
local utils = require("lib.utils")
local Lib = {}

function Lib.get_meta_for_file(file)
	local meta = {}
	local name = string.gsub(file, ".md", "")
	name = string.gsub(name, ".html", "")
	local filecontent = utils.getfiledata(file)
	if filecontent then
		local match = strings.split(filecontent, "---")

		if match[2] then
			local frontmatterParsed = yaml.decode(match[2])

			meta = {
				slug = name,
				title = frontmatterParsed.title,
			}
		end
	end
	return meta
end

function Lib.get_meta_for_path(basePath)
	local files = alvu.files(basePath)

	local meta = {}

	for file = 1, #files do
		if not string.find(files[file], "index.md") then
			local name = string.gsub(files[file], ".md", "")
			name = string.gsub(name, ".html", "")

			local filecontent = utils.getfiledata(basePath .. "/" .. files[file])
			if filecontent then
				local match = strings.split(filecontent, "---")

				if match[2] then
					local frontmatterParsed = yaml.decode(match[2])

					table.insert(meta, {
						slug = name,
						title = frontmatterParsed.title,
					})
				end
			end
		end
	end

	return meta
end

return Lib
