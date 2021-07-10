let timelineEntries = document.getElementsByClassName("timelineEntry");

for(i=0; i < timelineEntries.length; i++) {/* loop through every entry we have in the timeline */
	let element=timelineEntries[i];
	let activeIndex=i;
	if(element.addEventListener) {/* check if the current browser supports addEventListener */
		element.addEventListener("click", function() {updateContentDisplay(activeIndex);});/* by passing a copy of i (active index) we know the index of the element that was clicked on */
	}
	else {/* if the current dosen't browser support addEventListener (IE) use attachEvent instead */
		element.attachEvent("onclick", function() {updateContentDisplay(activeIndex);});
	}
}

function updateContentDisplay(activeIndex) {
	for(i=0; i < timelineEntries.length; i++) {
		child = findChildNodeByClassName(timelineEntries[i], "timelineBody");
		if(activeIndex==i) { /* activeIndex tells us the index of the element that was clicked on. If activeIndex==i, we want to show the description. */
			if(child.style.display=="none") { /* check if the object is already displayed or not */
				child.style.display="block";/* display the timeline entry that was clicked on */
			}
			else {
				child.style.display="none"; /* if the object was displayed when it was click on we want to hide it instead*/
			}; 
		}
		else {
			child.style.display="none"; /* hide timeline entries that weren't clicked on */
		}
	}
}

function findChildNodeByClassName(parentElement, className){
	for(var i=0; i < parentElement.childNodes.length; i++) {
		if(parentElement.childNodes[i].className == className) {
			return parentElement.childNodes[i];
		}
	}
	console.log("Element with class '"+className+"' not found in element: "+parentElement);
}