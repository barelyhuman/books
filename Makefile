.PHONY: dev build setup

setup:
	curl -sLf https://goblin.run/github.com/barelyhuman/alvu | PREFIX=./bin sh
	chmod +x ./bin/alvu
dev: 
	./bin/alvu -serve -poll 200 -highlight-theme monokai -highlight
build: 
	./bin/alvu -highlight-theme monokai -highlight
build.github: 
	./bin/alvu -baseurl /books/ -highlight-theme monokai -highlight