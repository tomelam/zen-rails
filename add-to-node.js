    // This works, but is HTML-specific and not OO. Instead of a function,
    // we want to add a method to HTML elements via Prototype's addMethods
    // function. And we want a 2-step process of creating a node and
    // adding it to its parent-to-be. In the first step, the HTML element
    // or widget to be added is instantiated. This process is recursive:
    // first the parent is created (but not appended to the DOM), then its
    // children are created and added to it. Finally, after all leaves
    // have been added to this new subtree, the top element or widget is
    // added to the old node (which might be a widget, thus requiring the
    // care of Dojo, for example.
    
    addToNode0 = function (node, array) {
	var i, newNode;
	//FIXME: This for loop is not optimized. See critique of
	//Google code (which Google code? I forget).
	for (i=0; i<array.length; i++) {
	    alert(array[i][0]);
	    newNode = document.createElement(array[i][0]);
	    node.appendChild(newNode);
	    addToNode0(newNode, array[i][1]);
	}
    }
    
    addToNode = function (node, array) {
	// Refinement of addToNode0 to handle HTML elements, text
	// elements, and other components (e.g. widgets) by calling
	// the right method function in place of createElement.
	var i, r, newNode;
	for (i=0; i<array.length; i++) {
	    console.debug('component => ' + array[i][0]);
	    r = rulesTable[array[i][0]];
	    console.debug('rule => ' + r);
	    newNode = s2f[r].call(document, array[i][0]);
	    console.debug('newNode => ' + newNode);
	    node.appendChild(newNode);
	    addToNode(newNode, array[i][1]);
	}
    }

    // Example use of addToNode:
    // addToNode(document.body, testArray2);