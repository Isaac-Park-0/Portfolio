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
		console.log(timelineEntries[i].childNodes[5].style.display);
		if(activeIndex==i) { /* activeIndex tells us the index of the element that was clicked on os when activeIndex==i, we want to show the description (.childNode[5]) for that entry */
			if(timelineEntries[i].childNodes[5].style.display=="none") { /* check if the object is already displayed or not */
				timelineEntries[i].childNodes[5].style.display="block";/* display the timeline entry that was clicked on */
			}
			else {
				timelineEntries[i].childNodes[5].style.display="none"; /* if the object was displayed when it was click on we wnat to hide it instead*/
			}; 
		}
		else {
			timelineEntries[i].childNodes[5].style.display="none"; /* hide timeline entries that weren't clicked on */
		}
	}
}