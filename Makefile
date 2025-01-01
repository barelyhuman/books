.PHONY: dev build

dev: 
	alvu -serve -poll 200 -highlight-theme monokai -highlight
build: 
	alvu -highlight-theme monokai -highlight
build.github: 
	alvu -baseurl /books/ -highlight-theme monokai -highlight