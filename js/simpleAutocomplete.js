(function(){
	var _stack = []
	
	function _selectRange(element, start, end){
		if(element.selectRange)
			return element.selectRange(start, end)

		if (element.setSelectionRange){
			element.focus();
			element.setSelectionRange(start, end);
		} else {
			var value = element.value

			var diff = value.substr(start, end - start).replace(/\r/g, '').length;
			start = value.substr(0, start).replace(/\r/g, '').length;
			var range = element.createTextRange();
			range.collapse(true);
			range.moveEnd('character', start + diff);
			range.moveStart('character', start);
			range.select();
		}
		return element;
	}

	function _searchInStack(abbreviation){
		var i = 0, maxIndex = -1, maxScore = 0, tempScore,
			matchIndex
		for(; i < _stack.length; i++){
			
			matchIndex = _stack[i].toLowerCase().indexOf(abbreviation.toLowerCase())

			if(matchIndex === 0 &&
				abbreviation.length < _stack[i].length){
				return _stack[i]
			}
		}

		return null
	}

	function _autocomplete(evt){
		if(!this.value)
			return

		var code = (window.event) ? evt.which : evt.keyCode
		
		//Backspace or delete or shift or alt or capslock or cmd
		if(code == 8 || 
			code == 46 || 
			code == 16 || 
			code == 17 || 
			code == 18 || 
			code == 20 || 
			code == 91){
			return
		}
		//Enter
		if(code == 13){
			this.setSelectionRange(this.value.length, this.value.length)
			return
		}
		//key arrows
		if(code > 36 && code < 41){
			return
		}

		var originalValue = this.value,
			match = _searchInStack(originalValue)

		if(match !== null){
			this.value = match;
			this.setSelectionRange(originalValue.length, match.length)
		}
	}

	function _addEvent(element, event_name, event_function) 
	{       
		if(element.attachEvent) //Internet Explorer
			element.attachEvent("on" + event_name, function() {event_function.call(element);}); 
		else if(element.addEventListener) //Modern browsers
			element.addEventListener(event_name, event_function, false);      
	} 

	function _simpleAutocomplete(element, stack){
		if(stack instanceof Array){
			_stack = stack
		}else{
			//Query
		}
		_addEvent(element, 'keyup', _autocomplete)
	}

	if('jQuery' in window)
		jQuery.fn.simpleAutocomplete = function(stack) {
			this.each(function(i, el){
				_simpleAutocomplete(el, stack)
			})
			return this
		}
	else if('MooTools' in window)
		Element.implement({
			simpleAutocomplete: function(stack) {
				_simpleAutocomplete(this, stack)
				return this
			}
		})
	else
		window.simpleAutocomplete = _simpleAutocomplete
})()