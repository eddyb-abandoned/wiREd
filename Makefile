TRACEUR:=node --stack_trace_limit=64 `npm bin`/traceur --experimental --trap-member-lookup=false --private-names=false

ARCH_LIST:=8051 x86
ARCH_JS:=$(ARCH_LIST:%=disasm/arch-%.js)

PLATFORM_LIST:=windows
PLATFORM_JS:=platform/platform.js $(PLATFORM_LIST:%=platform/%.h.js)

all: node_modules ${ARCH_JS} ${PLATFORM_JS}

node_modules: package.json
	@npm install
	@touch node_modules
.PRECIOUS: node_modules

disasm/arch-%.js: disasm/%.js disasm/Disasm.js disasm/codegen-js.js disasm/codegen-js-base.js node_modules
	@${TRACEUR} "$<" > /dev/null
.PRECIOUS: disasm/arch-%.js

%.analyzed: % analyzer.js ${ARCH_JS} ${PLATFORM_JS}
	@${TRACEUR} analyzer.js ${ANALYSIS_ARGS} "$<" > "$@" 2>&1
.PRECIOUS: %.analyzed

%.analyzed.html: %.analyzed deps/highlight.html
	@cat deps/highlight.html > "$@"
	@echo "<pre lang=js>" >> "$@"
	@cat "$<" | sed 's/</\&lt;/g' >> "$@"
	@echo "</pre>" >> "$@"

Password.dll:
	@wget -O "$@" http://eu.depot.battle.net:1119/8f52906a2c85b416a595702251570f96d3522f39237603115f2f1ab24962043c.auth

test: Password.dll.analyzed

clean:
	-rm -rf disasm/arch-*.js cparse/c11.y.js platform/*.h platform/*.h.js *.analyzed

.PHONY: all test clean

# CParse.
%.y.js: %.l %.y deps/codeaze/codeaze.js cparse/yacc2codeaze.js
	@${TRACEUR} cparse/yacc2codeaze.js "$*.l" "$*.y" > "$@"

%.h.js: %.h cparse/cparse.js cparse/c11.y.js
	@${TRACEUR} cparse/cparse.js "$<" > "$@"
.PRECIOUS: %.h.js

# Platform.
platform/windows.h: platform/windows.h.in
	@${CC} -I/usr/include/wine/windows -Ideps/mingw-w64/mingw-w64-{crt/include,headers/{crt,include}} -m32 -E -P -x c "$<" | sed 's/\s*#pragma.*//' > "$@"
