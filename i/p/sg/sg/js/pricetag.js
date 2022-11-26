function changeDivImage() { 
	var imgPath = new String(); 
	imgPath = document.getElementById("pr-tag-l").style.backgroundImage; 
 
	if (imgPath == "url(images/pr_tag_lg.png)" || imgPath == "") { 
		document.getElementById("pr-tag-l").style.backgroundImage = "url(images/pr_tag_lg_on.png)"; 
		} 
	else { 
		document.getElementById("pr-tag-l").style.backgroundImage = "url(images/pr_tag_lg.png)"; 
		} 
	}
	
	
function changeDivImage() { 
	var imgPath = new String(); 
	imgPath = document.getElementById("pr-tag-s").style.backgroundImage; 
 
	if (imgPath == "url(images/pr_tag_sm.png)" || imgPath == "") { 
		document.getElementById("pr-tag-s").style.backgroundImage = "url(images/pr_tag_sm_on.png)"; 
		} 
	else { 
		document.getElementById("pr-tag-s").style.backgroundImage = "url(images/pr_tag_sm.png)"; 
		} 
	}