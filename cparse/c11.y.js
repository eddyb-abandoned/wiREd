R('primary_expression', or(R('IDENTIFIER'), R('constant'), R('string'), and('(', _, R('expression'), _, ')'), R('generic_selection')));
R('constant', or(/((0[xX]))([a-fA-F0-9])+((((u|U)(l|L|ll|LL)?)|((l|L|ll|LL)(u|U)?)))?|([1-9])([0-9])*((((u|U)(l|L|ll|LL)?)|((l|L|ll|LL)(u|U)?)))?|0([0-7])*((((u|U)(l|L|ll|LL)?)|((l|L|ll|LL)(u|U)?)))?|((u|U|L))?'([^'\\\n]|((\\(['"\?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F0-9]+))))+'/, /([0-9])+(([Ee][+-]?([0-9])+))((f|F|l|L))?|([0-9])*\.([0-9])+(([Ee][+-]?([0-9])+))?((f|F|l|L))?|([0-9])+\.(([Ee][+-]?([0-9])+))?((f|F|l|L))?|((0[xX]))([a-fA-F0-9])+(([Pp][+-]?([0-9])+))((f|F|l|L))?|((0[xX]))([a-fA-F0-9])*\.([a-fA-F0-9])+(([Pp][+-]?([0-9])+))((f|F|l|L))?|((0[xX]))([a-fA-F0-9])+\.(([Pp][+-]?([0-9])+))((f|F|l|L))?/, R('ENUMERATION_CONSTANT')));
R('enumeration_constant', R('IDENTIFIER'));
R('string', or(/(((u8|u|U|L))?\"([^"\\\n]|((\\(['"\?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F0-9]+))))*\"([ \t\v\n\f])*)+/, /__func__\b/));
R('generic_selection', /_Generic\b/, _, '(', _, R('assignment_expression'), _, ',', _, R('generic_assoc_list'), _, ')');
R('generic_assoc_list', more(R('generic_association')).sep(_, ',', _));
R('generic_association', or(and(R('type_name'), _, ':', _, R('assignment_expression')), and(/default\b/, _, ':', _, R('assignment_expression'))));
R('postfix_expression', or(R('primary_expression'), and('(', _, R('type_name'), _, ')', _, /(\{|<%)/, _, R('initializer_list'), _, /(\}|%>)/), and('(', _, R('type_name'), _, ')', _, /(\{|<%)/, _, R('initializer_list'), _, ',', _, /(\}|%>)/)), any(_, or(and(/(\[|<:)/, _, R('expression'), _, /(\]|:>)/), and('(', _, ')'), and('(', _, R('argument_expression_list'), _, ')'), and('.', _, R('IDENTIFIER')), and('->', _, R('IDENTIFIER')), '++', '--')));
R('argument_expression_list', more(R('assignment_expression')).sep(_, ',', _));
R('unary_expression', or(R('postfix_expression'), and('++', _, R('unary_expression')), and('--', _, R('unary_expression')), and(R('unary_operator'), _, R('cast_expression')), and(/sizeof\b/, _, R('unary_expression')), and(/sizeof\b/, _, '(', _, R('type_name'), _, ')'), and(/_Alignof\b/, _, '(', _, R('type_name'), _, ')')));
R('unary_operator', or(/&(?![&=])/, '*', '+', '-', '~', '!'));
R('cast_expression', or(and('(', _, R('type_name'), _, ')', _, R('cast_expression')), R('unary_expression')));
R('multiplicative_expression', R('cast_expression'), any(_, or(and('*', _, R('cast_expression')), and('/', _, R('cast_expression')), and('%', _, R('cast_expression')))));
R('additive_expression', R('multiplicative_expression'), any(_, or(and('+', _, R('multiplicative_expression')), and('-', _, R('multiplicative_expression')))));
R('shift_expression', R('additive_expression'), any(_, or(and('<<', _, R('additive_expression')), and('>>', _, R('additive_expression')))));
R('relational_expression', R('shift_expression'), any(_, or(and('<', _, R('shift_expression')), and('>', _, R('shift_expression')), and('<=', _, R('shift_expression')), and('>=', _, R('shift_expression')))));
R('equality_expression', R('relational_expression'), any(_, or(and('==', _, R('relational_expression')), and('!=', _, R('relational_expression')))));
R('and_expression', more(R('equality_expression')).sep(_, /&(?![&=])/, _));
R('exclusive_or_expression', more(R('and_expression')).sep(_, '^', _));
R('inclusive_or_expression', more(R('exclusive_or_expression')).sep(_, /\|(?![|=])/, _));
R('logical_and_expression', more(R('inclusive_or_expression')).sep(_, '&&', _));
R('logical_or_expression', more(R('logical_and_expression')).sep(_, '||', _));
R('conditional_expression', or(and(R('logical_or_expression'), _, '?', _, R('expression'), _, ':', _, R('conditional_expression')), R('logical_or_expression')));
R('assignment_expression', or(and(R('unary_expression'), _, R('assignment_operator'), _, R('assignment_expression')), R('conditional_expression')));
R('assignment_operator', or('=', '*=', '/=', '%=', '+=', '-=', '<<=', '>>=', '&=', '^=', '|='));
R('expression', more(R('assignment_expression')).sep(_, ',', _));
R('constant_expression', R('conditional_expression'));
R('declaration', or(and(R('declaration_specifiers'), _, ';'), and(R('declaration_specifiers'), _, R('init_declarator_list'), _, ';'), R('static_assert_declaration')));
R('declaration_specifiers', or(and(R('storage_class_specifier'), _, R('declaration_specifiers')), R('storage_class_specifier'), and(R('type_specifier_no_typedef_names'), _, R('declaration_specifiers')), R('type_specifier_no_typedef_names'), and(R('TYPEDEF_NAME'), _, R('declaration_specifiers_after_typedef_name')), R('TYPEDEF_NAME'), and(R('type_qualifier'), _, R('declaration_specifiers')), R('type_qualifier'), and(R('function_specifier'), _, R('declaration_specifiers')), R('function_specifier'), and(R('alignment_specifier'), _, R('declaration_specifiers')), R('alignment_specifier')));
R('declaration_specifiers_after_typedef_name', or(and(R('storage_class_specifier'), _, R('declaration_specifiers_after_typedef_name')), R('storage_class_specifier'), and(R('type_qualifier'), _, R('declaration_specifiers_after_typedef_name')), R('type_qualifier'), and(R('function_specifier'), _, R('declaration_specifiers_after_typedef_name')), R('function_specifier'), and(R('alignment_specifier'), _, R('declaration_specifiers_after_typedef_name')), R('alignment_specifier')));
R('init_declarator_list', more(R('init_declarator')).sep(_, ',', _));
R('init_declarator', or(and(R('declarator'), _, '=', _, R('initializer')), R('declarator')));
R('storage_class_specifier', or(/typedef\b/, /extern\b/, /static\b/, /_Thread_local\b/, /auto\b/, /register\b/));
R('type_specifier_no_typedef_names', or(/void\b/, /char\b/, /short\b/, /int\b/, /long\b/, /float\b/, /double\b/, /signed\b/, /unsigned\b/, /_Bool\b/, /_Complex\b/, /_Imaginary\b/, R('atomic_type_specifier'), R('struct_or_union_specifier'), R('enum_specifier')));
R('type_specifier', or(R('type_specifier_no_typedef_names'), R('TYPEDEF_NAME')));
R('struct_or_union_specifier', or(and(R('struct_or_union'), _, /(\{|<%)/, _, R('struct_declaration_list'), _, /(\}|%>)/), and(R('struct_or_union'), _, R('IDENTIFIER'), _, /(\{|<%)/, _, R('struct_declaration_list'), _, /(\}|%>)/), and(R('struct_or_union'), _, R('IDENTIFIER'))));
R('struct_or_union', or(/struct\b/, /union\b/));
R('struct_declaration_list', more(R('struct_declaration')).sep(_));
R('struct_declaration', or(and(R('specifier_qualifier_list'), _, ';'), and(R('specifier_qualifier_list'), _, R('struct_declarator_list'), _, ';'), R('static_assert_declaration')));
R('specifier_qualifier_list', or(and(R('type_specifier_no_typedef_names'), _, R('specifier_qualifier_list_no_typedef_names')), R('type_specifier_no_typedef_names'), and(R('TYPEDEF_NAME'), _, R('specifier_qualifier_list_after_typedef_name')), R('TYPEDEF_NAME'), and(R('type_qualifier'), _, R('specifier_qualifier_list')), R('type_qualifier')));
R('specifier_qualifier_list_no_typedef_names', or(and(R('type_specifier_no_typedef_names'), _, R('specifier_qualifier_list_no_typedef_names')), R('type_specifier_no_typedef_names'), and(R('type_qualifier'), _, R('specifier_qualifier_list_no_typedef_names')), R('type_qualifier')));
R('specifier_qualifier_list_after_typedef_name', or(and(R('type_qualifier'), _, R('specifier_qualifier_list_after_typedef_name')), R('type_qualifier')));
R('struct_declarator_list', more(R('struct_declarator')).sep(_, ',', _));
R('struct_declarator', or(and(':', _, R('constant_expression')), and(R('declarator'), _, ':', _, R('constant_expression')), R('declarator')));
R('enum_specifier', or(and(/enum\b/, _, /(\{|<%)/, _, R('enumerator_list'), _, /(\}|%>)/), and(/enum\b/, _, /(\{|<%)/, _, R('enumerator_list'), _, ',', _, /(\}|%>)/), and(/enum\b/, _, R('IDENTIFIER'), _, /(\{|<%)/, _, R('enumerator_list'), _, /(\}|%>)/), and(/enum\b/, _, R('IDENTIFIER'), _, /(\{|<%)/, _, R('enumerator_list'), _, ',', _, /(\}|%>)/), and(/enum\b/, _, R('IDENTIFIER'))));
R('enumerator_list', more(R('enumerator')).sep(_, ',', _));
R('enumerator', or(and(R('enumeration_constant'), _, '=', _, R('constant_expression')), R('enumeration_constant')));
R('atomic_type_specifier', /_Atomic\b/, _, '(', _, R('type_name'), _, ')');
R('type_qualifier', or(/const\b/, /restrict\b|__restrict__\b/, /volatile\b|__volatile__\b/, /_Atomic\b/, R('attribute_specifier')));
R('function_specifier', or(/inline\b|__inline__\b/, /_Noreturn\b/));
R('alignment_specifier', or(and(/_Alignas\b/, _, '(', _, R('type_name'), _, ')'), and(/_Alignas\b/, _, '(', _, R('constant_expression'), _, ')')));
R('attribute_specifier', /__attribute__\b/, _, '(', _, '(', _, R('attribute_list'), _, ')', _, ')');
R('attribute_list', more(R('attribute')).sep(_, ',', _));
R('attribute', or(and(R('IDENTIFIER'), _, '(', _, R('attribute_parameter_list'), _, ')'), R('IDENTIFIER')));
R('attribute_parameter_list', more(R('attribute_parameter')).sep(_, ',', _));
R('attribute_parameter', or(R('IDENTIFIER'), R('constant'), R('string')));
R('declarator', or(and(R('pointer'), _, R('direct_declarator')), and(R('attribute_specifier'), _, R('declarator')), R('direct_declarator')));
R('direct_declarator', or(R('IDENTIFIER'), and('(', _, R('declarator'), _, ')')), any(_, or(and(/(\[|<:)/, _, /(\]|:>)/), and(/(\[|<:)/, _, '*', _, /(\]|:>)/), and(/(\[|<:)/, _, /static\b/, _, R('type_qualifier_list'), _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, /static\b/, _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, '*', _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, /static\b/, _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('assignment_expression'), _, /(\]|:>)/), and('(', _, R('parameter_type_list'), _, ')'), and('(', _, ')'), and('(', _, R('identifier_list'), _, ')'), R('attribute_specifier'))));
R('pointer', or(and('*', _, R('type_qualifier_list'), _, R('pointer')), and('*', _, R('type_qualifier_list')), and('*', _, R('pointer')), '*'));
R('type_qualifier_list', more(R('type_qualifier')).sep(_));
R('parameter_type_list', or(and(R('parameter_list'), _, ',', _, '...'), R('parameter_list')));
R('parameter_list', more(R('parameter_declaration')).sep(_, ',', _));
R('parameter_declaration', or(and(R('declaration_specifiers'), _, R('declarator')), and(R('declaration_specifiers'), _, R('abstract_declarator')), R('declaration_specifiers')));
R('identifier_list', more(R('IDENTIFIER')).sep(_, ',', _));
R('type_name', or(and(R('specifier_qualifier_list'), _, R('abstract_declarator')), R('specifier_qualifier_list')));
R('abstract_declarator', or(and(R('pointer'), _, R('direct_abstract_declarator')), R('pointer'), and(R('attribute_specifier'), _, R('abstract_declarator')), R('direct_abstract_declarator')));
R('direct_abstract_declarator', or(and('(', _, R('abstract_declarator'), _, ')'), and(/(\[|<:)/, _, /(\]|:>)/), and(/(\[|<:)/, _, '*', _, /(\]|:>)/), and(/(\[|<:)/, _, /static\b/, _, R('type_qualifier_list'), _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, /static\b/, _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, /static\b/, _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('assignment_expression'), _, /(\]|:>)/), and('(', _, ')'), and('(', _, R('parameter_type_list'), _, ')')), any(_, or(and(/(\[|<:)/, _, /(\]|:>)/), and(/(\[|<:)/, _, '*', _, /(\]|:>)/), and(/(\[|<:)/, _, /static\b/, _, R('type_qualifier_list'), _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, /static\b/, _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, /static\b/, _, R('assignment_expression'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('type_qualifier_list'), _, /(\]|:>)/), and(/(\[|<:)/, _, R('assignment_expression'), _, /(\]|:>)/), and('(', _, ')'), and('(', _, R('parameter_type_list'), _, ')'))));
R('initializer', or(and(/(\{|<%)/, _, R('initializer_list'), _, /(\}|%>)/), and(/(\{|<%)/, _, R('initializer_list'), _, ',', _, /(\}|%>)/), R('assignment_expression')));
R('initializer_list', or(and(R('designation'), _, R('initializer')), R('initializer')), any(_, or(and(',', _, R('designation'), _, R('initializer')), and(',', _, R('initializer')))));
R('designation', R('designator_list'), _, '=');
R('designator_list', more(R('designator')).sep(_));
R('designator', or(and(/(\[|<:)/, _, R('constant_expression'), _, /(\]|:>)/), and('.', _, R('IDENTIFIER'))));
R('static_assert_declaration', /_Static_assert\b/, _, '(', _, R('constant_expression'), _, ',', _, /(((u8|u|U|L))?\"([^"\\\n]|((\\(['"\?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F0-9]+))))*\"([ \t\v\n\f])*)+/, _, ')', _, ';');
R('statement', or(R('labeled_statement'), R('compound_statement'), R('expression_statement'), R('selection_statement'), R('iteration_statement'), R('jump_statement'), R('asm_statement')));
R('labeled_statement', or(and(R('IDENTIFIER'), _, ':', _, R('statement')), and(/case\b/, _, R('constant_expression'), _, ':', _, R('statement')), and(/default\b/, _, ':', _, R('statement'))));
R('compound_statement', or(and(/(\{|<%)/, _, /(\}|%>)/), and(/(\{|<%)/, _, R('block_item_list'), _, /(\}|%>)/)));
R('block_item_list', more(R('block_item')).sep(_));
R('block_item', or(R('declaration'), R('statement')));
R('expression_statement', or(';', and(R('expression'), _, ';')));
R('selection_statement', or(and(/if\b/, _, '(', _, R('expression'), _, ')', _, R('statement'), _, /else\b/, _, R('statement')), and(/if\b/, _, '(', _, R('expression'), _, ')', _, R('statement')), and(/switch\b/, _, '(', _, R('expression'), _, ')', _, R('statement'))));
R('iteration_statement', or(and(/while\b/, _, '(', _, R('expression'), _, ')', _, R('statement')), and(/do\b/, _, R('statement'), _, /while\b/, _, '(', _, R('expression'), _, ')', _, ';'), and(/for\b/, _, '(', _, R('expression_statement'), _, R('expression_statement'), _, ')', _, R('statement')), and(/for\b/, _, '(', _, R('expression_statement'), _, R('expression_statement'), _, R('expression'), _, ')', _, R('statement')), and(/for\b/, _, '(', _, R('declaration'), _, R('expression_statement'), _, ')', _, R('statement')), and(/for\b/, _, '(', _, R('declaration'), _, R('expression_statement'), _, R('expression'), _, ')', _, R('statement'))));
R('jump_statement', or(and(/goto\b/, _, R('IDENTIFIER'), _, ';'), and(/continue\b/, _, ';'), and(/break\b/, _, ';'), and(/return\b/, _, ';'), and(/return\b/, _, R('expression'), _, ';')));
R('asm_statement', or(and(/asm\b|__asm__\b/, _, '(', _, R('asm_parameters'), _, ')', _, ';'), and(/asm\b|__asm__\b/, _, /volatile\b|__volatile__\b/, _, '(', _, R('asm_parameters'), _, ')', _, ';')));
R('asm_parameters', or(and(R('string'), _, ':', _, R('expression'), _, ':', _, R('expression'), _, ':', _, R('expression')), and(R('string'), _, ':', _, ':', _, R('expression'), _, ':', _, R('expression')), and(R('string'), _, ':', _, R('expression'), _, ':', _, ':', _, R('expression')), and(R('string'), _, ':', _, ':', _, ':', _, R('expression')), and(R('string'), _, ':', _, R('expression'), _, ':', _, R('expression')), and(R('string'), _, ':', _, ':', _, R('expression')), and(R('string'), _, ':', _, R('expression')), R('string')));
R('translation_unit', more(R('external_declaration')).sep(_));
R('external_declaration', or(R('function_definition'), R('declaration')));
R('function_definition', or(and(R('declaration_specifiers'), _, R('declarator'), _, R('declaration_list'), _, R('compound_statement')), and(R('declaration_specifiers'), _, R('declarator'), _, R('compound_statement'))));
R('declaration_list', more(R('declaration')).sep(_));
