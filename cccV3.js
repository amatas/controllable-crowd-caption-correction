/*
	var debugIt;
	var myroomid;
	var authenticatedCorrector;
	var userinfo;
	var userInitials;


var userInfo {
	"room" : "",
	"initials" : "",
	"credentials" : ""
};
*/
	
var SHOW_AJAX_DATA_FLAG = true;


//=========================================================//
//settings-related variables
var fontWeightCheckbox = false;   //corresponds to "normal", er...not bold
var fontWeightCheckbox = false;   //corresponds to "normal", er...not bold
var correctedCaptionsUnderlineCheckbox = true;   //
var scrollingTurnedOn = true;

/*KEEP as a sample
	.caption {
		background-color: #FFFFFF;
		color: #000000;
		font-family: arial;
		font-weight: normal;
		font-size: 18px;
	}
*/
//going to use js to see because browser returns rgb() instead of hex.
//This interferes with settings utility, which wants hex.

var captionOrig_bc = "#FFFFFF";
var captionOrig_c = "#000000";
var captionOrig_ff = "Arial";
var captionOrig_fw = "normal";
var captionOrig_fs = "18px";

var lockedOrig_bc = "#FFFF00";
var lockedOrig_c = "#000000";

var correctedOrig_bc = "#FFFFFF";
var correctedOrig_c = "#FF0000";

//hex representation of current "color" settings;  Will get others from DOM
var caption_bc;
var caption_c;
var locked_bc;
var locked_c;
var corrected_bc;
var corrected_c;

var NODETYPE_TEXT = 3;
var NODETYPE_ELEMENT = 1;
//=========================================================//
//commands

var ROOM_PARAM = "room";
var CORRECTOR_COMMAND_PARAM = "cmd";
var CORRECTOR_PWD_PARAM = "pwd";
var CORRECTOR_PARAM = "who";
var STARTRANGE_PARAM = "strt";
var ENDRANGE_PARAM = "end";
var DATA_PARAM = "data";
var DOCVERSION_PARAM = "ver";
var MEETINGDOCID_PARAM = "id";
var RESPONSE_STATUS_PARAM = "resp";
var RESPONSE_REASON_PARAM = "reas";
var ACCEPT_INDICATOR = "accept";
var DENY_INDICATOR = "deny";

var ADMIN_RESPONSE_STATUS_PARAM = "adminrsp";
var ADMIN_RESPONSE_REASON_PARAM = "adminre";
var ADMIN_RESPONSE_STATUS_OK = "OK";
var ADMIN_RESPONSE_STATUS_NOK = "NOK";

/*
commands used:

"CA";
"CL";
"CO";
"DE";
"ED";
"L";
"NE";
"OV";
"PA";
"PD";
"PE";
"QU";
"RE";
"SD";
"SP";

*/

var CAPTION_COMMAND = "C";
var CAPTION_RECALL_COMMAND = "CR";
var CAPTIONER_PARAGRAPH_COMMAND = "P";
var CAPTIONER_PARAGRAPH_RECALL_COMMAND = "PR";

var LOCK_COMMAND = "L";
var EDIT_COMMAND = "ED";
var CANCELLOCK_COMMAND = "CL";
var DELETEALL_COMMAND = "DE";
var COMMA_COMMAND = "CO";
var PERIOD_COMMAND = "PE";
var QUESTION_COMMAND = "QU";
var CAPITALIZE_COMMAND = "CA";
var LOWERCASE_COMMAND = "LC";
var REMOVEPUNCTUATION_COMMAND = "RP";
var PARAGRAPH_COMMAND = "PA";
var NEWSPEAKER_COMMAND = "NE";
var OVERRIDE_COMMAND = "OV";

var RESTORE_COMMAND = "RE";
var SPEAKEREDIT_COMMAND = "SP";
var PARADELETE_COMMAND = "PD";
var SPEAKERDELETE_COMMAND = "SD";



var ajaxResp = {
	"resp" : "",
	"ver" : 0,
	"cmd" : "",
	"strt" : 0,
	"end" : 0,
	"data" : ""
};


//=========================================================//
//quick-click keys plus housekeeping

var userInput = {
	"90": "key_Z",
	"88": "key_X",
	"67": "key_C",
	
	"76": "key_L",
	"71": "key_G",
	"66": "key_B",
	"78": "key_N",
	"77": "key_M",
	"188": "key_Comma",
	"190": "key_Period",
	"191": "key_ForwardSlash",
	"79": "key_O",
	
	"82": "key_R",
	"83": "key_S",

	"docver" : -1,
	"target": {},
	"clientX" : -1,
	"clientY" : -1,
	
	"key" : "",
	"mouseDownSpanId" : -1
};



//=========================================================//
//polling related variables
var POLL_TIMEOUT = 500;
var stopFlag = false;		//set to false when requesting polling to stop

var immediatePollRequested = false;		//flag indicating a request was made to poll immediately, rather than wait for timeout
var pollingTimerEvent;
var inPollRequest = false;

//=========================================================//
//scrolling related variables
var scrollingTimerEvent;
var prevScrollTop = 0;

var scrollingIsOn = true;  //whether currently automatically scrolling
var scrollingIsPaused = false;

var CaptionsHaveChanged = 0;   // this variable to be set to 1 by each back-end JavaScript call that changes the captions
//var scrollingTurnedOn = true; //defined above

	
//=========================================================//
//
var UNINITIALIZED_VALUE = -1;
var JOIN_AT_CURRENT_PLACE = -1;
var JOIN_FROM_BEGINNING = 0;

var globalState = {
	"contentNode" : null,
	"resetFlagSet" : false,
	"clientGeneratedParagraphCnt" : 0,
	"lockId" : 0,
	"meetingDocId" : JOIN_AT_CURRENT_PLACE,
	"documentVersion" : JOIN_AT_CURRENT_PLACE

};

var editState = {
	"editBoxId" : "captionEditBox",
	"hiddenTextSizerId" : "sizetext",
	"specialEdit" : "",
	"editType" : "",
	"editing" : false,
	"lowerEditRange" : -1,
	"upperEditRange" : -1,
	"originalSelectedText" : "",
	"lockRequestPending" : false,
	"documentVersion" : -1
};

//=========================================================//
// element attributes

//states:

var LOCKED_ATTRIBUTE = "ccclock";
var EDITING_ATTRIBUTE = "cccediting";	//put on spans that are under active edit (edit box showing).  Initials of editor doing the editing are put here
var EDITED_ATTRIBUTE = "cccedited";		//put on spans that have been edited (original text is in here)
var QUICKCLICK_ATTRIBUTE = "cccquick";	//put on spans modified by quick-clicks.  Type of quick-click (i.e. name of command) put in here
var DELETED_ATTRIBUTE = "cccdelall";		//put on spans where text was deleted completely.  ((??Initials of editor placed here

var EDITOR_ATTRIBUTE = "ccceditor";		//put on spans that have been edited (initials of editor(s) put here


var TOOLTIP_ATTRIBUTE = "title";


//var EDITGROUP_ATTRIBUTE = "cccegrp"; 	 //put on spans whose text was removed as part of an edit group.  ID of head of edit group put here

//======= paragraph attributes
var SPECIALPARAFOLLOWS_ATTRIBUTE = "cccnextpara";	//put on paragraph before (i.e previous sibling to) new corrector-generated paragraph to get paragraph mark;
var CORRECTORPARA_ATTRIBUTE = "cccmypara";	//put on corrector-generated paragraph to mark it

var NEWSPEAKER_ATTR = "cccnewspeaker"; //put on paragraphs with newspeakers;
var SPEAKER_TEXT_FIELD_ATTR = "cccspeaker"; //put on paragraphs with newspeakers - holds the speaker text


var DELETED_PLACEHOLDER = "\u00a0";
var PARAGRAPH_PLACEHOLDER = "\u00b6";

var PARAGRAPH_MARK  = "\u00b6";
var PARAGRAPH_PLUS_MARK = PARAGRAPH_MARK + "+spkr";

var SHOWSPEAKER_TEXT = "show";
var HIDE_TEXT = "hide";
var NEW_SPEAKER_TEXT = "Speaker: ";
var NEWSPEAKER_MARK = ">>";
//var NEW_PARAGRAPH_TEXT = "newparagraph";


//========================================================//
//========================================================//
function debug(text) {
	if (debugIt && window.console) {
		window.console.log(text);
	}
}

//========================================================//
//========================================================//
function debug1(text) {
	if (SHOW_AJAX_DATA_FLAG && window.console) {
		window.console.log(text);
	}
}

//========================================================//
//========================================================//
function errorOut(text) {
	if (window.console) {
		window.console.log(text);
	}
	//alert("Error:" + text);
}

//========================================================//
//========================================================//
function setKeyDown(event) {
//http://unixpapa.com/js/testkey.html
	var returnVal = true;
	var keyCode;
	
	//pause scrolling when key pressed to facilitate editing
	scrollingIsPaused = true;

	//ignore keystrokes if not a corrector
	if (authenticatedCorrector) {
		keyCode = (event.hasOwnProperty('which')) ? event.which : event.keyCode;
		debug('setKeyDown::event.keyCode:'+keyCode);
		
		if (keyCode === 27) {
			//if (document.getElementById("overlay1").style.visibility == "visible") {
			//	document.getElementById("overlay1").style.visibility = "hidden";
			//}
		
			preventDefaultBehavior(event);
			returnVal = false;
		} else {
			userInput.key = userInput[keyCode];
			//trap for hot-key in Mozilla
			//=== FUTURE check if running Mozilla browser.  For now, do on all ===//
			if ((keyCode === 191) && noCurrentEdit() ){
				preventDefaultBehavior(event);
				returnVal = false;
			}
		}
	}
	debug('setKeyDown:: DONE');
	return returnVal;
}

//========================================================//
//========================================================//
function setKeyUp(event) {

	debug('setKeyUp:: START');

	var keyCode;
	
	//allow scrolling to resume again if was stopped when key was pressed down
	scrollingIsPaused = false;

	if (authenticatedCorrector) {
		keyCode = (event.hasOwnProperty('which')) ? event.which : event.keyCode;
		debug('setKeyUp::event.keyCode:'+keyCode);
		userInput.key = "";
	}
	debug('setKeyUp:: DONE');
}

//========================================================//
//========================================================//
function preventDefaultBehavior(e) {
	//prevent event handler from continuing on with default behavior
	//for browser.  e.g. escape key, enter key
	if (e.preventDefault) {
		e.preventDefault();
	}
	if (e.returnValue) {
		e.returnValue = false;
	}
}

var debugCnt = 0;
//========================================================//
//========================================================//
function setMouseDownSpanId(event) {
	var tmpElem;
	var result;
	debug('setMouseDownSpanId:: START');
	
	//pause scrolling when key pressed to facilitate editing
	scrollingIsPaused = true;
	
	if (authenticatedCorrector) {
		debug('setMouseDownSpanId:: mousedown?: event.target.id: '+event.target.id);

		debugCnt++;
		if (debugCnt > 10) {
			debugCnt = 1;
		}
		//may need to check if you clicked on a span that is empty but not hidden
		//...not sure if that is possible, but we don't want that to happen.
		//As of now, we are not deleting blank spans but we can't hide them either
		//since we only hide items being edited while the input box is visible.
		
		if (noCurrentEdit() && !editState.lockRequestPending) {
		//if (getEditNode() === null) {
			if  ((event.target.id !== "") && !isNaN(event.target.id)) {
				userInput.mouseDownSpanId = parseInt(event.target.id,10);
			} else {
				userInput.mouseDownSpanId = -1;
			}
			//save target and mouse info for examination later....
			userInput.target = event.target;
			//userInput.offsetX = event.offsetX;
			//userInput.offsetY = event.offsetY;
			
			userInput.clientX = event.clientX;
			userInput.clientY = event.clientY;
			
			userInput.docver = globalState.documentVersion;  //use version of doc when mouse down was pressed
			/*************************
			//sometimes getting target.id of outer form (f1capcontent) instead of what we really want....check into this.
			//verify whether we want "" or null
			if  ((event.target.id !== "") && !isNaN(event.target.id)) {
				//event.target.id is id of element that triggered the event
				userInput.mouseDownSpanId = parseInt(event.target.id,10);
				//decide if should check for and save the key pressed (if any) when mouse down, or allow keys after mouse down to still work
				//userInput.activeKey = userInput.key;
				debug('setMouseDownSpanId:: userInput.mouseDownSpanId:'+userInput.mouseDownSpanId);
			} else {
				tmpElem = event.target;
				//look for an indication it is a paragraph with a newspeaker or corrector-added paragraph
				if ((tmpElem.nodeName === "P") && ((tmpElem.getAttribute(NEWSPEAKER_ATTR) != null) || (tmpElem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) )) {
					//okay pretty sure we got the paragraph so see we clicked on ::before  or ::after portion
					result = determineWhatWeClickedOn(event);
					if (result == "speaker") {
						doQuickSpeakerEdit(tmpElem.firstChild.id, tmpElem.getAttribute(NEWSPEAKER_ATTR), SPEAKEREDIT_COMMAND);
						//userInput.key = "";
					} else if (result == "paragraph") {
						doQuickParagraphEdit(tmpElem.lastChild.id, PARADELETE_COMMAND);
						//userInput.key = "";
					}
				} else {
					debug ('setMouseDownSpanId:: error on event.target.id: ' + event.target.id);
				}
			}
			
			
			****************************/
		} else {
			debug('setMouseDownSpanId:: Edit box found.  Ignoring mouse-down');
		}
	}
	debug('setMouseDownSpanId:: END');
}
//========================================================//
//========================================================//
function getElementPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

//========================================================//
//========================================================//
function getPreviousEditableSpan(id) {
	//get previous editable span of paragraph
	var returnVal = id;
	var aSpan;

	if ((aSpan = document.getElementById(id)) != null) {
		while (true) {
			if ((aSpan = aSpan.previousSibling) == null) {
				//at beginning of paragraph
				break;
			} else if (spanIsMarkedTextDeleted(aSpan)) {
				//stop 
				break;
			} else if (aSpan.firstChild != null) {
				//found an existing text node - assume not empty so done
				returnVal = aSpan.id;
				break;
			} else {
				//no text node so save id and keep going
			}
		}
	}
	return returnVal;
}

//========================================================//
//========================================================//
function getLastEditableSpan(elem) {
	//get last editable span of paragraph
	var last = null;
	
	if (elem != null) {
		last = elem.lastChild;
		while (last != null) {
			if (last.firstChild == null) {
				//part of edit group.  backup until get to main span
				last = last.previousSibling;
			} else {
				break;
			}
		}
	}
	return last;
}

//========================================================//
//========================================================//
function determineWhatWeClickedOn(event) {
	var result = "";
	var lowId;
	var highId;

	var paraPos;

	var firstSpan;
	var firstSpanPos;
	var lastSpan;
	var lastSpanPos;
	var mousePos;

	
	var elem = event.target;

	//LAST SIBLING SHOWING IS NOT NECESSARILY LAST SIBLING.  REMEMBER EDIT GROUPS!!!!!
	//FIX
	
	//
	
	//see if a special paragraph
	if ( (elem != null) && (elem.nodeName === "P") && ((elem.getAttribute(NEWSPEAKER_ATTR) != null) || (elem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) )) {
		//okay, it is special.  Find out where clicked
		paraPos = getElementPosition(elem);
		//get first span of paragraph
		firstSpan = elem.firstChild;
		//get last editable span of paragraph
		lastSpan = getLastEditableSpan(elem);
		
		//Could happend if corrector deletes spans
		if ((firstSpan != null) && (lastSpan != null)) {
			firstSpanPos = getElementPosition(firstSpan);
			lastSpanPos = getElementPosition(lastSpan);
			
			//mousePos = {x : paraPos.x + event.offsetX, y : paraPos.y + event.offsetY};

			mousePos = {x : event.clientX, y : event.clientY};
			
			/*until we narrow down width of new speaker or paragraph, we will use the more lenient one 
			if (((mousePos.x < firstSpanPos.x) && (mousePos.y >= firstSpanPos.y) && (mousePos.y <= firstSpanPos.y + firstSpan.offsetHeight))  || ((mousePos.x >= firstSpanPos.x) && (mousePos.y < firstSpanPos.y))) {
			*/
			if ( ((mousePos.x < firstSpanPos.x) && (mousePos.y >= firstSpanPos.y) && (mousePos.y <= firstSpanPos.y + firstSpan.offsetHeight))  || (mousePos.y < firstSpanPos.y) ) {
				//we clicked near paragraph begin indicating we probably clicked on new-speaker
				if (elem.getAttribute(NEWSPEAKER_ATTR) != null) {
					result = "speaker";
					lowId = firstSpan.getAttribute("id");
					highId = lowId;
					//lastSpan = getLastEditableSpan(elem.previousSibling);
					//if (lastSpan == null) {
					//	lowId = highId;
					//} else {
					//	lowId = lastSpan.getAttribute("id");
					//}
				}
			/*
			} else if (((mousePos.x > lastSpanPos.x + lastSpan.offsetWidth) && (mousePos.y >= lastSpanPos.y) && (mousePos.y <= lastSpanPos.y + lastSpan.offsetHeight))  || ((mousePos.x >= lastSpanPos.x) && (mousePos.y > lastSpanPos.y + lastSpan.offsetHeight))) {
			*/
			} else if (((mousePos.x > lastSpanPos.x + lastSpan.offsetWidth) && (mousePos.y >= lastSpanPos.y) && (mousePos.y <= lastSpanPos.y + lastSpan.offsetHeight))  || (mousePos.y > lastSpanPos.y + lastSpan.offsetHeight) ) {
				//we clicked near paragraph end;  //end mark always on same line as last displayed span
				if (event.target.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) {
					result = "paragraph";
					lowId = lastSpan.getAttribute("id");
					highId = lowId;
					//move high id to next paragraph span if one there.
					if ((elem = elem.nextSibling) != null) {
						if ((firstSpan = elem.firstChild) != null) {
							highId = firstSpan.getAttribute("id");
						}
					}
				}
			}
		}
	}
	//if "speaker", 
	//		lowspan = id of first span of paragraph
	//		highspan = id of first span of paragraph
	
	//if "paragraph", 
	//		lowspan = id of last edit group of paragraph (may be a deleteall)
	//		highspan = lowspan OR id of first span of next paragraph, if there is one
	
	
	return {"target" : result, "lowspan" : parseInt(lowId,10), "highspan" : parseInt(highId,10)};
}


//========================================================//
//========================================================//
function setMouseUpSpanId(event) {
	debug('setMouseUpSpanId:: START');
	var mouseUpSpanId;
	var end;
	var tempElem;
	var result;
	
	//pause scrolling when key pressed to facilitate editing
	scrollingIsPaused = false;
	if (authenticatedCorrector) {
		//don't allow edit if have an edit underway, or we canceled edit but still waiting to send cancel
		if (noCurrentEdit() && !editState.lockRequestPending) {
		//if (getEditNode() == null) {
			//did we release on a span?
		 	if  ((event.target.id != "") && !isNaN(event.target.id)) {
				mouseUpSpanId = parseInt(event.target.id,10);
			} else {
				mouseUpSpanId = -1;
			}
			
			//Now figure out what we clicked on....
			//if mouse down and mouse up on a span, process here
			if ((mouseUpSpanId >= 0) && (userInput.mouseDownSpanId >= 0)) {
				//clicked on spans on each end. 
					
				//orient mouse down/up
				if (mouseUpSpanId < userInput.mouseDownSpanId) {
					end = userInput.mouseDownSpanId;
					userInput.mouseDownSpanId = mouseUpSpanId;
					mouseUpSpanId = end;
				}
		/*
				if (userInput.key == "key_R") {
					// This is a restore command attempt which may cross paragraph boundaries
					doQuickClickRangeRestore(userInput.mouseDownSpanId, mouseUpSpanId, RESTORE_COMMAND);
					
				//no other command allowed across paragraphs that start and end on a span
				} else if (document.getElementById(userInput.mouseDownSpanId).parentNode === document.getElementById(mouseUpSpanId).parentNode) {
		*/

				if (document.getElementById(userInput.mouseDownSpanId).parentNode === document.getElementById(mouseUpSpanId).parentNode) {
				//quick-clicks or edit if both ends on same paragraph
					
					switch (userInput.key) {
						case "key_Z":
						case "key_ForwardSlash":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickExtended(mouseUpSpanId, QUESTION_COMMAND);
							}
							break;
						case "key_X":
						case "key_Period":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickExtended(mouseUpSpanId, PERIOD_COMMAND);
							}
							break;
						case "key_C":
						case "key_Comma":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, COMMA_COMMAND);
							}
							break;
						case "key_B":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, CAPITALIZE_COMMAND);
							}
							break;
						case "key_G":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, LOWERCASE_COMMAND);
							}
							break;
						case "key_L":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								doQuickClickBasic(mouseUpSpanId, REMOVEPUNCTUATION_COMMAND);
							}
							break;
						case "key_N":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								//if new speaker already there, ignore if clicked on first span
								tempElem = document.getElementById(mouseUpSpanId);
								if (tempElem.parentNode.firstChild == tempElem) {
									//clicked on first span.  See if new speaker already there
									if (tempElem.parentNode.getAttribute(NEWSPEAKER_ATTR) == null) {
										//okay to proceed
										doQuickClickTwoWayExpanded(mouseUpSpanId, NEWSPEAKER_COMMAND);
									} // else skip, cuz already there
								} else {
									doQuickClickTwoWayExpanded(mouseUpSpanId, NEWSPEAKER_COMMAND);
								}
							}
							break;
						case "key_M":
							if (userInput.mouseDownSpanId == mouseUpSpanId) {
								//doQuickClickTwoWayExpanded(mouseUpSpanId, PARAGRAPH_COMMAND);
								//proceed only if NOT clicked on first span of a paragraph
								tempElem = document.getElementById(mouseUpSpanId);
								if (tempElem.parentNode.firstChild != tempElem) {
									doQuickClickTwoWayExpanded(mouseUpSpanId, PARAGRAPH_COMMAND);
								}
							}
							break;
						case "key_O":
							// This is an OVERRIDE. 
							sendCommand(userInput.mouseDownSpanId, getEndOfEditGroup(mouseUpSpanId,false), OVERRIDE_COMMAND, userInput.docver, "");
							break;
						case "key_R":
							// This is an restore original caption. 
							doQuickClickRangeRestore(userInput.mouseDownSpanId, mouseUpSpanId, RESTORE_COMMAND);
							break;
						case undefined:
						case "":
						default:
							//enlarge range to include blank spans - for stale data problem
							end = getEndOfEditGroup(mouseUpSpanId,false);
							if (isAnyInRangeLocked(userInput.mouseDownSpanId,end) == false) {
								debug('setMouseUpSpanId:: call startEditing()');
								startEditing(userInput.mouseDownSpanId, end);
								debug('setMouseUpSpanId:: back from startEditing()');
							} else {
								debug('setMouseUpSpanId:: someone has lock alread');
							}
					}
				} else {
					debug("setMouseUpSpanId:: can't edit across paragraphs");
				}
				
			// Appears a special might be involved.  Can only restore a special or edit a newspeaker.  Either way, we can only click on the single special element.  What is requested?
			} else if ((mouseUpSpanId < 0) && (userInput.mouseDownSpanId < 0) &&  (event.target === userInput.target)) {
				//it appears both ends are not spans and are the same target element.
				//Check further. Start on up-mouse event
				result = determineWhatWeClickedOn(event);
				if (result.target == "speaker") {
					//check if down was also on speaker
					result = determineWhatWeClickedOn(userInput);
					if (result.target == "speaker") {
						end = getEndOfEditGroup(result.highspan,false);
						if (isAnyInRangeLocked(result.lowspan,end) == false) {
							//and edit or restore?
							if (userInput.key == "key_R") {
								//restore
								doQuickSpeakerDelete(result.lowspan,end, SPEAKERDELETE_COMMAND);
							} else {
								//edit
								editSpeakerSpecial(result.lowspan, end);
							}
						}
					}
				} else if (result.target == "paragraph") {
					//check if down was also on paragraph
					result = determineWhatWeClickedOn(userInput);
					if ((result.target == "paragraph") && (userInput.key == "key_R")) {
						//restore paragraph
						end = getEndOfEditGroup(result.highspan,false);
						if (isAnyInRangeLocked(result.lowspan,end) == false) {
							doQuickParagraphDelete(result.lowspan,end, PARADELETE_COMMAND);
						}
					}
				}
			} else {
				//ignore everything else
			}
			
			
			/*
			
			} else if (userInput.key == "key_R") {
				//okay, going to try a restore.  Let's figure out what to use for range while we are figuring out if a special is involved on at least one end
				
				//initialize range values;
				info.high = -1;
				info.low = Number.MAX_VALUE;
				info.condlow = 0;
				info.condhigh = 0;
				
				//if span involved on mouse up, lock that value in
				if (mouseUpSpanId >= 0) {
					//mouse up on a span.  Save that info
					if (userInput.mouseUpSpanId < info.low) {
						info.low = mouseUpSpanId;
					}
					if (userInput.mouseUpSpanId > info.high) {
						info.high = mouseUpSpanId;
					}
				}
				//if span involved on mouse down, lock that value in
				if (userInput.mouseDownSpanId >= 0) {
					if (userInput.mouseDownSpanId < info.low) {
						info.low = userInput.mouseDownSpanId;
					}
					if (userInput.mouseDownSpanId > info.high) {
						info.high = userInput.mouseDownSpanId;
					}
				}
				//now figure out if special involved

				//do mouseup first
				tmpElem = event.target;
				result = determineWhatWeClickedOn(event);
				if (result.target =! "") {
					if (result.lowspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.lowspan < info.low) {
							info.low = result.lowspan;
						}
						if (result.lowspan > info.high) {
							info.high = result.lowspan;
						}
					}
					if (result.highspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.highspan < info.low) {
							info.low = result.highspan;
						}
						if (result.highspan > info.high) {
							info.high = result.highspan;
						}
					}
				//now mouse down
				result = determineWhatWeClickedOn(userInput);
				if (result.target =! "") {
					if (result.lowspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.lowspan < info.low) {
							info.low = result.lowspan;
						}
						if (result.lowspan > info.high) {
							info.high = result.lowspan;
						}
					}
					if (result.highspan >= 0) {
						//mouse up on a span.  Save that info
						if (result.highspan < info.low) {
							info.low = result.highspan;
						}
						if (result.highspan > info.high) {
							info.high = result.highspan;
						}
					}

				}
							tmpElem = event.target;
				if ((mouseUpSpanId < 0) && (userInput.mouseDownSpanId < 0) &&  (userInput.key == "") && (tmpElem === userInput.target)) {
					//down and up on same target.  Check further, to make sure one of OUR specials
					if ((tmpElem.nodeName === "P") && ((tmpElem.getAttribute(NEWSPEAKER_ATTR) != null) || (tmpElem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE) != null) )) {
						//okay pretty sure we got the paragraph so see if we clicked on ::before  or ::after portion
						//check up mouse settings
						result = determineWhatWeClickedOn(event);
						if (result.target == "speaker") {
							//check if down was also on speaker
							result = determineWhatWeClickedOn(userInput);
							if (result.target == "speaker") {
								//restore speaker
							
							}
						} else if (result == "paragraph") {
							//check if down was also on paragraph
							result = determineWhatWeClickedOn(userInput);
							if (result.target == "paragraph") {
								//restore paragraph
							
							}
						}
					} 

			
			// Not a restore so only thing left is an edit.  Can't edit a range that includes a special and a span.  (both ends must be on special) Check if down and up on same special 
			} else {
				tmpElem = event.target;
				if ((mouseUpSpanId < 0) && (userInput.mouseDownSpanId < 0) &&  (userInput.key == "") && (tmpElem === userInput.target)) {
					//down and up on same target.  Check further, to make sure one of OUR specials
					if ((tmpElem.nodeName === "P") && (tmpElem.getAttribute(NEWSPEAKER_ATTR) != null) ) {
						//okay pretty sure we got the paragraph so see if we clicked on ::before portion
						//check up mouse settings
						result = determineWhatWeClickedOn(event);
						if (result.target == "speaker") {
							//check if down was also on speaker
							result = determineWhatWeClickedOn(userInput);
							if (result.target == "speaker") {
								//edit speaker
								specialEdit(result.span.getAttribute("id"),0);
							}
						}
					}
				}
			}
			
			*/
			
			
			
			userInput.mouseDownSpanId = -1;
			//Don't wait for keyup to come (it will not come, in some situations) if onblur not setup or other cases
			userInput.key = "";

		} //getEditNode
	} //authenticated user
	debug('setMouseUpSpanId:: END');
}

//========================================================//
//========================================================//
function doQuickClickBasic(start,command) {
	debug('doQuickClickBasic:: START');
	debug('doQuickClickBasic::start=:'+start+'  :command=:'+command);

	var end;
	
	//don't allow quick clicks on deleteall spans
	if (!spanIsMarkedTextDeleted(document.getElementById(start))) {
		end = getEndOfEditGroup(start,false);

		//make sure none of the range is locked
		if (isAnyInRangeLocked(start,end) == false) {
			editState.documentVersion = userInput.docver;
			sendCommand(start, end, command, editState.documentVersion, "");
		}
	}
	debug('doQuickClickBasic:: END');
}

//========================================================//
//========================================================//
function doQuickClickTwoWayExpanded(clickedId,command) {
	debug('doQuickClickTwoWayExpanded:: START');
	debug('doQuickClickTwoWayExpanded::start=:'+clickedId+'  :command=:'+command);

	//need to find where next span is to capitalize - not necessarily to deal with stale issue
	var end = clickedId;
	var start = clickedId;
	
	//don't allow quick clicks on deleteall spans
	if (!spanIsMarkedTextDeleted(document.getElementById(clickedId))) {
		//not okay to pass around a deleteall span for capitalization
		end = getEndOfEditGroup(clickedId, false);
		//get span before
		start = getPreviousEditableSpan(clickedId);
		//make sure none of the range is locked
		if (isAnyInRangeLocked(start,end) == false) {
			editState.documentVersion = userInput.docver;
			sendCommand(start, end, command, editState.documentVersion, hexEncoder("" + clickedId));
		}
	}
	debug('doQuickClickTwoWayExpanded:: END');
}

//========================================================//
//========================================================//
function doQuickClickExtended(start,command) {
	debug('doQuickClickExtended:: START');
	debug('doQuickClickExtended::start=:'+start+'  :command=:'+command);

	var capFlag = "";
	//need to find where next span is to capitalize - not necessarily to deal with stale issue
	var end;
	var aSpan;
	
	//don't allow quick clicks on deleteall spans
	if (!spanIsMarkedTextDeleted(document.getElementById(start))) {
		//not okay to pass around a deleteall span for capitalization
		end = getEndOfEditGroup(start, false);

		//We will check if a capitalization span exists and pass that range along with the flag so comet backend knows what to do.
		//If no capitalization span exists (e.g. word clicked is at end of a paragraph), the range only includes the range of the edit group
		
		aSpan = document.getElementById(end);
		if ((aSpan != null) && ((aSpan = aSpan.nextSibling) != null) && (aSpan.firstChild != null) && (!spanIsMarkedTextDeleted(aSpan)) ) {
			//signal to backend to capitalize span in data portion
			capFlag = aSpan.id;
			//move end to end of edit group of this element
			end = getEndOfEditGroup(capFlag, false);
		}

		//make sure none of the range is locked
		if (isAnyInRangeLocked(start,end) == false) {
			editState.documentVersion = userInput.docver;
			sendCommand(start, end, command, editState.documentVersion, hexEncoder("" + capFlag));
		}
	}
	debug('doQuickClickExtended:: END');
}

//========================================================//
//========================================================//
/*
function doQuickSpeakerEdit(id,text,command) {
	var result;
	debug('doQuickSpeakerEdit:: START');

	result = prompt("Edit Speaker", text);

	if (result != null) {
		editState.documentVersion = userInput.docver;
		//sendCommand(id, id, command, editState.documentVersion, id + "~" + result);
		sendCommand(id, id, command, editState.documentVersion, result);
	}
	debug('doQuickSpeakerEdit:: END');
}
*/

//========================================================//
//========================================================//
function doQuickSpeakerDelete(start,end,command) {
	//debug('doQuickSpeakerDelete:: START');

	doDialog(start, end, command, "", "Delete speaker text?", "Delete");

	//debug('doQuickSpeakerDelete:: END');
}

//========================================================//
//========================================================//
function doQuickParagraphDelete(start,end,command) {
	//debug('doQuickParagraphDelete:: START');

	var tmpElem;
	var question;
	
	//check if just paragraph or speaker and paragraph.  don't know if end in current para or next so use start
	tmpElem = document.getElementById(start);
	if ((tmpElem != null) && ((tmpElem = tmpElem.parentNode) != null) && ((tmpElem = tmpElem.nextSibling) != null) && (tmpElem.getAttribute(NEWSPEAKER_ATTR) != null)) {
		question = "Delete paragraph break and \"Speaker\" text?";
	} else {
		question = "Delete paragraph break?";
	}

	doDialog(start, end, command, "", question, "Delete");

	//debug('doQuickParagraphDelete:: END');
}


//========================================================//
//========================================================//
function doQuickClickRangeRestore(start,end,command) {
	//debug('doQuickClickRangeRestore:: START');

	var data;
	var displayText;

	end = getEndOfEditGroup(end,false);

	//make sure none of the range is locked
	if (isAnyInRangeLocked(start,end) == false) {
		data = getCurrentAndOriginal(start, end);
		//if span text to restore
		if (data.restoreText != "") {
			displayText = "ORIGINAL: " + data.restoreText + "<br><br>CURRENT: " + data.currentText + "<br><br>";
			
			doDialog(start, end, command, displayText, "Restore Original?", "Restore");
		}
	}
	//debug('doQuickClickRangeRestore:: END');
}

//========================================================//
//========================================================//
function doDialog(start,end,command, text, question, button) {
	//debug('doDialog:: START');

	editState.editing = true;
	editState.lockRequestPending = true;
	editState.documentVersion = userInput.docver;
	//setInputEventHandlers(tmpElem);
	editState.lowerEditRange = start;
	editState.upperEditRange = end;
	editState.editType = command;
	//tmpElem.focus();
	//tmpElem.select();
	
	document.getElementById("ov1text").innerHTML = text;
	document.getElementById("ov1question").textContent = question;
	document.getElementById("ov1button1").textContent = button;
	document.getElementById("ov1button1").onclick = function () {
		if (!editState.lockRequestPending) {
			//removeDialog1();
			//clear further events
			//clearInputEventHandlers(tmpNode);
			
			//indicate we are done editing
			editState.editing = false;
			
			//send command
			sendCommand(editState.lowerEditRange, editState.upperEditRange, command, editState.documentVersion, "");
		}
	};
	document.getElementById("ov1cancel").onclick= function () {
		cancelEdit();
	};
	
	//send lock request
	sendCommand(editState.lowerEditRange, editState.upperEditRange, LOCK_COMMAND, editState.documentVersion, "");

	//display dialog
	document.getElementById("overlay1").style.visibility = "visible";

	debug('doDialog:: END');
}


//========================================================//
//========================================================//
function getCurrentAndOriginal(start, end){
	var text = {"restoreText": "", "currentText": ""};
	var correctArray = [];
	var origArray = [];
	var i;
	var textStart = -1;
	var textEnd = -1;
	var orig;
	var curText;
	var aSpan;
	var sib;
	var tmpText;
	
	for (i = start; i <= end; i++) {
		//orig = "";
		curText = "";
		if ((aSpan = document.getElementById(i)) != null) {
			try {
				sib = aSpan.firstChild;
				while (sib != null) {
					if (sib.nodeType == NODETYPE_TEXT) {
						tmpText = sib.textContent;
						//handle special cases
						if (spanIsMarkedTextDeleted(aSpan) && (tmpText == DELETED_PLACEHOLDER)) {
							tmpText = "";
						}
						curText += tmpText;
					}
					sib = sib.nextSibling;
				}
			} catch (e) {
				errorOut('Error trying to get .textContent: '+ e.message);
			}
			//get text.  If none, nothing to restore
			if ((orig = getOriginalSpanText(aSpan)) != null) {
				if (textStart == -1) {
					textStart = i-start;
				}
				textEnd = i - start;
			} else {
				orig = curText;
			}
			origArray[i-start] = orig;
			correctArray[i-start] = curText;
		}
	}
	if (textStart != -1) {
		for (i = textStart; i <= textEnd; i++) {
			text.restoreText += origArray[i];
			text.currentText += correctArray[i];
		}
	} 
	
	return text;
}		

/*
//========================================================//
//========================================================//
function paraToRestore(start, end) {

get parent of start
get last child of parent
if last child id is < end
	do
	get next sibling of parent
	if parent is editorcreated 
		mark;
		break; done
	else get last child of parent
	while last child id is < end
return marked?

	var aSpan;
	var aPar;
	var result = false;

	aPar = document.getElementById(start).parentNode;
	aSpan = aPar.lastChild;
	if (aSpan.id < end) {
		do {
			aPar = aPar.nextSibling;
			if (aPar.getAttribute("mypara") != null) {
				result = true;
				break;
			} else {
				aSpan = aPar.lastChild;
			}
		} while (aSpan.id < end);
	}
	return result;
}
*/
//========================================================//
//========================================================//
//To help detect stale edits, extend edit ranges to include trailing spans that have been 
//collapsed into edit groups.  (i.e. no child of nodetype=text)
function getEndOfEditGroup(id,extendPastTextDeleted) {
	
	var returnVal = id;
	var aSpan;

	//extend range by including subsequent spans which have null text elements
	//=== added: which have null text elements OR blank non-null text elements
	//=== CHANGED: which only have null text elements
	if ((aSpan = document.getElementById(id)) != null) {
		while (true) {
			if ((aSpan = aSpan.nextSibling) == null){
				//at end (end of paragraph). This is okay
				break;
			} else if (spanIsMarkedTextDeleted(aSpan)) {
				//decide how to handle this special case based on flag passed in.
				if (extendPastTextDeleted) {
					//update and keep going
					returnVal = aSpan.id;
				} else {
					//stop at textdeleted. we're done
					break;
				}
			} else if (aSpan.nodeName.toUpperCase() != "SPAN") {
				//need to check for input element - or rather not SPAN element, cuz backend uses this routine too
				//we're done
				break;
			} else if (aSpan.firstChild != null) {
				//found an existing text node - assume not empty so done
				break;
			} else {
				//no text node so save id and keep going
				returnVal = aSpan.id;
			}
		}
	}
	return returnVal;
}

//========================================================//
//========================================================//
function startEditing(start, end) {
	debug('startEditing START::lowerEditRange=:'+start+'  :upperEditRange=:'+end);

	var buildTextLayer = "";
	var tmpElem;
	var i, j;
	var noProblem = true;
	var sib;
	var tmpText;

	editState.lowerEditRange = start;
	editState.upperEditRange = end;

	for (i = start; i <= end; i++) {
		//collect text from spans.  Hide along the way as will be part of edit group
		if ((tmpElem = document.getElementById(i)) != null) {

			if (!spanIsMarkedEditing(tmpElem)) {
				try {
					sib = tmpElem.firstChild;
					//NOTE:  USING NODETYPE CUZ AT ONE TIME CONSIDERING PUTTING IN <BR> ELEM IN FOR PARAGRAPHS
					while (sib != null) {
						if (sib.nodeType == NODETYPE_TEXT) {
							tmpText = sib.textContent;
							//handle special cases
							if (spanIsMarkedTextDeleted(tmpElem) && (tmpText == DELETED_PLACEHOLDER)) {
								tmpText = "";
							}
							buildTextLayer += tmpText;
						} else if (sib.nodeType == NODETYPE_ELEMENT) {
							//assume <br>
							buildTextLayer += PARAGRAPH_PLACEHOLDER; //need some other special character
						}
						sib = sib.nextSibling;
					}
				} catch (e) {
					errorOut('Error trying to get .textContent: '+ e.message);
				}
				//indicate it is in our edit group 
				setSpanEditingFlag(tmpElem,userInitials);
				setSpanEditingStyle(tmpElem);

			} else {
				//it is already being edited by us - not sure how we could get to this point but it is not right
				errorOut("startEditing::span id i=:" + i + " ERROR Span appears to be in an edit right now");
				noProblem = false;
				break;
			}
		} else {
			noProblem = false;
			//span missing along the range
			errorOut("startEditing::span id i=:" + i + " ERROR span missing");
		}
	}
	debug('startEditing::buildTextLayer=:'+buildTextLayer);
	
	if (noProblem) {
		// Set the variable to what is in the textbox. 
		// This is to do a comparison when Enter is pressed to see if the text has actually changed
		editState.originalSelectedText = buildTextLayer;
		
		editState.editType = "";	//just a normal edit
		editState.editing = true;
		editState.lockRequestPending = true;
		editState.documentVersion = userInput.docver;
		
		//reuse old node if still laying around.  Shouldn't be.
		if ((tmpElem = document.getElementById(editState.editBoxId)) == null) {
			tmpElem = document.createElement("input");
			tmpElem.setAttribute("id",editState.editBoxId); 
		} else {
			debug ("**********************Old edit node found");
		}
		tmpElem.type = "text";
		tmpElem.className = "caption";
		tmpElem.setAttribute("editor",userInitials);
		tmpElem.setAttribute("style", "width: 200px");
		setInputEventHandlers(tmpElem);
		
		tmpElem.defaultValue = buildTextLayer;
		tmpElem.value = buildTextLayer;

		//put the edit box just before (previousSibling) the lower span
		document.getElementById(start).parentNode.insertBefore(tmpElem, document.getElementById(start));
		tmpElem.focus();
		tmpElem.select();
		resizeEditBox(tmpElem);

		//send lock request
		sendCommand(start, end, LOCK_COMMAND, editState.documentVersion, "");
	} else {
		//undo all the editing marks .. start though i-1  (i.e. j<i)
		for (j = start; j < i; j++) {
			//unhideElement(document.getElementById(j));
			if ((tmpElem = document.getElementById(j)) != null) {
				unsetSpanEditingFlag(tmpElem);
				unsetSpanEditingStyle(tmpElem);
			}
		}
	}
	debug('startEditing:: END');
	return noProblem;
}

//========================================================//
//========================================================//
function editSpeakerSpecial(start, end) {
	debug('specialEdit START::lowerEditRange=:'+start+'  :upperEditRange=:'+end);

	var tmpElem;
	var parentElem;
	
	// Set the variable to what is in the textbox. 
	// This is to do a comparison when Enter is pressed to see if the text has actually changed


	editState.editing = true;
	editState.lockRequestPending = true;
	editState.documentVersion = userInput.docver;
	
	tmpElem = document.createElement("input");
	tmpElem.setAttribute("id",editState.editBoxId); 

	tmpElem.type = "text";
	tmpElem.className = "caption";
	tmpElem.setAttribute("editor",userInitials);
	tmpElem.setAttribute("style", "width: 200px");
	setInputEventHandlers(tmpElem);
	
	/*
	if (start == 0) {
		editState.lowerEditRange = end;
		editState.upperEditRange = end;
		parentElem = document.getElementById(end).parentNode;
		editState.originalSelectedText = parentElem.getAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
		
		//hide current text
		parentElem.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,HIDE_TEXT);
		//put the edit box just after last span
		parentElem.appendChild(tmpElem);
		editState.editType = PARADELETE_COMMAND;

	} else {
	*/
		editState.lowerEditRange = start;
		editState.upperEditRange = end;
		parentElem = document.getElementById(start).parentNode;
		editState.originalSelectedText = parentElem.getAttribute(SPEAKER_TEXT_FIELD_ATTR);
		
		tmpElem.defaultValue = editState.originalSelectedText;
		tmpElem.value = editState.originalSelectedText;

		//hide current text
		parentElem.setAttribute(NEWSPEAKER_ATTR, HIDE_TEXT);
		//put the edit box just before (previousSibling) the lower span
		parentElem.insertBefore(tmpElem, document.getElementById(start));
		editState.editType = SPEAKEREDIT_COMMAND;
/*	}
*/


	tmpElem.focus();
	tmpElem.select();
	resizeEditBox(tmpElem);

	//send lock request
	sendCommand(editState.lowerEditRange, editState.upperEditRange, LOCK_COMMAND, editState.documentVersion, "");

	debug('specialEdit:: END');
	return 
}


//========================================================//
//========================================================//
function removeDialog1() {
	//clearInputEventHandlers();
	document.getElementById("ov1button1").onclick= null;
	document.getElementById("ov1cancel").onclick = null;

	//remove the dialog box and restore
	document.getElementById("ov1text").innerHTML = "";
	document.getElementById("ov1question").textContent = "";
	document.getElementById("ov1button1").textContent = "";
	document.getElementById("overlay1").style.visibility = "hidden";
}

//========================================================//
//========================================================//
function cancelEditBlur() {
	debug('cancelEditBlur::Start');
	cancelEdit();
	debug('cancelEditBlur::Done ');
}

//========================================================//
//========================================================//
//remove edit node- this is only place in the code where we can remove the edit node.  (i.e must call cancelEdit() if you need to remove it)
//set edit status to false to indicate we are done editing
//if we have a lock on the spans, cancel the lock
//if we are still waiting for the lock response, let ajax response send cancel lock (if necessary) based on edit flag status
function cancelEdit() {

	debug('cancelEdit::Start:editing=:'+editState.editing);

	//careful.  removing the tag may trigger the onBlur handler..
	
	var aSpan;
	var tmpStart, tmpEnd;
	var parentElem;

	if ((tmpStart = getEditNode()) != null) {
		//clear this so no additional cancels come in
		clearInputEventHandlers(tmpStart); 

		//if special edit do this
		if (editState.editType == SPEAKEREDIT_COMMAND) {
			//remove the input element
			parentElem = tmpStart.parentNode;
			parentElem.removeChild(tmpStart);
			//unhide newspeaker
			parentElem.setAttribute(NEWSPEAKER_ATTR,SHOWSPEAKER_TEXT);

			if (editState.editing) {
				//clear the "we are editing" flag
				editState.editing = false;
				if (!editState.lockRequestPending) {
					//send the cancel
					sendCommand(editState.lowerEditRange, editState.upperEditRange, CANCELLOCK_COMMAND, editState.documentVersion, "");
				} //else handle in the ajax response function
			} 
		} else if (editState.editType == "") {
		
			//get 1st span in edit range
			aSpan = tmpStart.nextSibling;
			
			//remove the input element
			tmpStart.parentNode.removeChild(tmpStart);

			//get the first element of edit group
			if (aSpan != null) {
				tmpStart = aSpan.id;
				tmpEnd = tmpStart;
				
				//"unset" editing while keeping track of end of range so can use later
				while (aSpan != null) {
					if (spanIsMarkedEditing(aSpan)) {
						unsetSpanEditingFlag(aSpan);
						unsetSpanEditingStyle(aSpan);
						tmpEnd = aSpan.id;
						aSpan = aSpan.nextSibling;
					} else {
						//we reached end of editing range
						break;
					}
				}
				if (editState.editing) {
					//clear the "we are editing" flag
					editState.editing = false;
					if (!editState.lockRequestPending) {
						//send the cancel
						sendCommand(tmpStart, tmpEnd, CANCELLOCK_COMMAND, editState.documentVersion, "");
					} //else handle in the ajax response function
				} else {
					//no longer editing - which means we sent the 
					//edit already and backend is cancelling the edit.  No need to cancel lock at this point.
					debug("canceEdit:: Already sent edit so no unlock command to send.");
				}
			} else {
				//clear the "we are editing" flag (if editing)
				editState.editing = false;
			}
		}
	} else if ((editState.editType == RESTORE_COMMAND) || (editState.editType == SPEAKERDELETE_COMMAND) || (editState.editType == PARADELETE_COMMAND) ) {
		//remove the dialog box and restore
		removeDialog1();

		
		if (editState.editing) {
			//clear the "we are editing" flag
			editState.editing = false;
			if (!editState.lockRequestPending) {
				//send the cancel
				sendCommand(editState.lowerEditRange, editState.upperEditRange, CANCELLOCK_COMMAND, editState.documentVersion, "");
			} //else handle in the ajax response function
		} 
	} else {
		debug("cancelEdit:: NO EDIT in progress.");
	}
	debug("cancelEdit::done");
}


//========================================================//
//========================================================//
//http://unixpapa.com/js/testkey.html
//document.onkeyup=resizeEditBox;  //find a better place for this.  Also note difference between keypress and key down/up and pick appropriate one

function processInputChar(me,event) {

	debug('processInputChar:: START with me:'+me);
	
	var returnVal = true;
	var tmpNode;
	var newText;
	var key = '';
	
	//watch out of difference between onkeypress and onkeydown as well as keycode vs charcode for non-char keys
	//for keypress, event.which exists, but is 0 for escape in some browsers, so need to get keyCode.

	key = (event.hasOwnProperty('which')) ? event.which : event.keyCode;

	// check for escape out of editing
	if (key == 27) {
		debug('processInputChar::key = 27 ESC ::START');
		cancelEdit();
		//need to block the default behavior of the ESC key which kills the loading of pages - i.e. kills comet
		preventDefaultBehavior(event);

		debug('processInputChar::key = 27 ESC ::DONE');
		returnVal = false;
		
	} else if (key == 13) {
		//enter key
		debug("processInputChar::key = 13 ENTER key ::START");
		//make sure re-entry into this portion is blocked after 1st pass until comet 
		//server gets around to applying the edit and thereby removing the event handler calls
		//
		/*
		if ((tmpNode = getEditNode()) != null) {
			//we still have the edit box
			
			//wait for lock request response before allowing edit
			if (!editState.lockRequestPending) {
			*/
			
		//wait for lock request response before allowing edit
		if (!editState.lockRequestPending) {
		
			if ((tmpNode = getEditNode()) != null) {
				//we still have the edit box
			
				//strip off leading and trialing spaces
				newText = tmpNode.value;
				newText = newText.replace(/^\s+|\s+$/g,'');

				// If text was unchanged then treat just like a cancel edit
				if (newText == editState.originalSelectedText.replace(/^\s+|\s+$/g,'')) {
					//both are the same
					cancelEdit();
					
				} else {
					//send edit, but first....

					//clear further events
					clearInputEventHandlers(tmpNode);
					//indicate we are done editing
					editState.editing = false;
					
					if (editState.editType == SPEAKEREDIT_COMMAND) {
						newText = hexEncoder(newText);
						sendCommand(editState.lowerEditRange, editState.upperEditRange, SPEAKEREDIT_COMMAND, editState.documentVersion, newText);

					// If the text was completely deleted, then send the DELETEALL_COMMAND code
					} else if (newText == "") {
						sendCommand(editState.lowerEditRange, editState.upperEditRange, DELETEALL_COMMAND, editState.documentVersion, "");
					} else {
						newText = hexEncoder(newText);
						sendCommand(editState.lowerEditRange, editState.upperEditRange, EDIT_COMMAND, editState.documentVersion, newText);
					}
					
					//block default behavior in browser (submits form?)
					preventDefaultBehavior(event);

					debug("processInputChar::key = 13 ENTER key ::DONE");
				}
			} else if (waitingToConfirmEdit()) {
				//we still have the dialog box
				//send command, but first....

				//clear further events
				//clearInputEventHandlers(tmpNode);
				//indicate we are done editing
				editState.editing = false;
				sendCommand(editState.lowerEditRange, editState.upperEditRange, editState.editType, editState.documentVersion, "");

				//block default behavior in browser (submits form?)
				preventDefaultBehavior(event);
				debug("processInputChar::key = 13 ENTER key ::DONE");
			} else {
				debug("processInputChar::key = 13 Edit/dialog box no longer exists");
				//debug("processInputChar::key = 13 Still waiting for lockRequst...");
			}
		} else {
			debug("processInputChar::key = 13 Still waiting for lockRequst...");
			//debug("processInputChar::key = 13 Edit box no longer exists");
		}
		debug("processInputChar::key = 13 ENTER key ::END");
		
	} else {
		//not a special key
		if (!waitingToConfirmEdit() ) {
			resizeEditBox(me);
		}
	}

	debug('processInputChar::: done');
	return returnVal;
	
}

//========================================================//
//========================================================//
function resizeEditBox(me) {
	var elem = document.getElementById(editState.hiddenTextSizerId);
	elem.textContent = (me.value).replace(/\s\s/g, " .") + "Wm";
	me.style.width = elem.offsetWidth + "px";
}

//========================================================//
//========================================================//
function setInputEventHandlers(tmpNode) {

	tmpNode.setAttribute("onkeydown","processInputChar(this,event)");
	tmpNode.setAttribute("onkeyup","resizeEditBox(this)");
	tmpNode.setAttribute("onBlur","cancelEditBlur()"); 
	tmpNode.setAttribute("onFocus","processInputChar(this,event)"); 
	tmpNode.setAttribute("onChange","processInputChar(this,event)"); 
}
//========================================================//
//========================================================//
function clearInputEventHandlers(tmpNode) {

	tmpNode.removeAttribute("onkeydown");
	tmpNode.removeAttribute("onkeyUp"); 
	tmpNode.removeAttribute("onBlur"); 
	tmpNode.removeAttribute("onFocus"); 
	tmpNode.removeAttribute("onChange"); 
}

//========================================================//
//========================================================//
function sendCommand(lower, upper, command, ver, data) {

	var x1 = CORRECTOR_COMMAND_PARAM + "=" + command + "&" + STARTRANGE_PARAM + "=" + lower + "&" + ENDRANGE_PARAM + "=" +  upper + "&" + DOCVERSION_PARAM + "=" + ver + "&" + DATA_PARAM + "=" + data;

	xmlhttpPost("capreceiver",x1);
}

//========================================================//
//========================================================//
function clearEditState() {
	editState.editing = false;
	editState.lowerEditRange = -1;
	editState.upperEditRange = -1,
	editState.originalSelectedText = "",
	editState.lockRequestPending = false,
	editState.documentVersion = -1
}

//========================================================//
//========================================================//
function resetAndReloadClient(docId) {

	var aSpan;
	var tmpSpan;
	var contentNode = document.getElementById("doccontent");

	if ((aSpan = getEditNode()) != null) {
		//clear this so no additional cancels come in
		clearInputEventHandlers(aSpan);
	}
	
	if (waitingToConfirmEdit()) {
		removeDialog1();
	}
	
	clearEditState();
	
	//decide whether to allow start from existing place or start from beginning.
	//
	//if current meetingDocId is not yet set, set it to the new meetingDocId and set docVersion to -1.
	//else, if current meetingDocId is already set and equal to an earlier version, update it to the new version and set docVersion to 0;
	//Will need to set/return these values on the server side when checking permissions for each user, but for now,
	// do it here.
	
	if (globalState.meetingDocId == UNINITIALIZED_VALUE) {
		globalState.documentVersion = JOIN_AT_CURRENT_PLACE;
	} else {
		globalState.documentVersion = JOIN_FROM_BEGINNING;
	}
	document.getElementById("meetstats").textContent = "Doc ver: " + globalState.documentVersion;
	globalState.meetingDocId = docId;
	globalState.resetFlagSet = true;
	globalState.lockId = 0;
	
	contentNode = document.getElementById("f1capcontent");
	//unload the doc from the DOM
	contentNode.removeChild(document.getElementById("doccontent"));
	//start with new one
	aSpan = document.createElement("div");
	aSpan.setAttribute("id","doccontent");
	tmpSpan = document.createElement("p");
	tmpSpan.setAttribute("id","P0");
	aSpan.appendChild(tmpSpan);
	contentNode.appendChild(aSpan);

}


//========================================================//
//========================================================//
function xmlhttpPost(strURL,parameterStr) {

	var MAXIMUM_WAITING_TIME = 15000; //milliseconds
	var xmlHttpReq = null;

	if (window.XMLHttpRequest) {
		try {
			xmlHttpReq = new window.XMLHttpRequest();
		} catch (e) {
			return false;
		}
	}
	if (!xmlHttpReq) {
		errorOut('xmlhttpPoll:: Cannot create XLMHTTP instance');
		return false;
	}

	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
	} 

	try {
		xmlHttpReq.open('POST', strURL, true);	//don't wait
		//xmlHttpReq.open('POST', strURL, false);  //wait
	} catch (e)  {
		errorOut("error: " + e);
		return false;
	}
	/*var requestTimer = setTimeout(function() {
		debug('xmlhttpPost:: aborting request; timeout reached');
		debug('xmlhttpPost:: aborting for value='+xmlHttpReq.value);
		lockRequestPending = false;
		xmlHttpReq.abort();
		//tell it was aborted
		}, MAXIMUM_WAITING_TIME);
*/
	xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttpReq.setRequestHeader('Cache-Control', 'no-cache');
	xmlHttpReq.onreadystatechange = function () {
		var responseStr = "";
		var response = "";
		var len;
		var len2;
		var tmp;
		var data;
 
		
		try {
			var clearInPostRequestFlag = true;
			if (this.readyState === 1) {
				//debug1('xmlhttpPost::xmlHttpReq.readyState=1');
			} 
			else if (this.readyState === 2) {
				//debug1('xmlhttpPost::xmlHttpReq.readyState=2');
			}
			else if (this.readyState === 3) {
				//debug1('xmlhttpPost::xmlHttpReq.readyState=3: responseText3=:'+this.responseText);
			}
			else if (this.readyState === 4) {
				//clearTimeout(requestTimer); //do not abort

				//if client page reset while we were waiting for response, just skip everything
				if (!globalState.resetFlagSet) { 
					if (this.status == 200) {
						
						responseStr = this.responseText;
						if (responseStr.charAt(0) == "{") {
							ajaxResp = JSON.parse(responseStr);
						} else {
							len = parseInt(responseStr,10);
							len2 = responseStr.indexOf("{");
							len = len2 + len;
							tmp = responseStr.slice(len2,len);
							ajaxResp = JSON.parse(tmp);
							data = responseStr.slice(len);
							/////////////CurrentPosition = responseStr.substring(tmpIndex+9,tmpIndex2);
						}
						
						if ((typeof ajaxResp[ADMIN_RESPONSE_STATUS_PARAM]) != "undefined") {
							tmp = ajaxResp[ADMIN_RESPONSE_STATUS_PARAM];
							//got some administrative response.  This is not good.  Skip processing
						} else {
						
							//if this was a response to the lock request and was accepted, and we are still editing, we are done here.
							//But if we are no longer editing, we must have cancelled the edit (ESC) - so we now have to send the undo command.  (undo-sending was delayed pending the response)
							//BTW we are not allowing a correction send until lock request response received
							
							//if it was a lock request and it was denied, and we are still editing, we cancel the edit.  No undo need be sent.
							//If we have already cancelled the edit, we do nothing.  No undo was sent
							
							if (ajaxResp[RESPONSE_STATUS_PARAM] == ACCEPT_INDICATOR) {
								//command accepted.  check special case handling i.e. for Lock
								if (ajaxResp[CORRECTOR_COMMAND_PARAM] == LOCK_COMMAND) {
									//get new edit doc version
									editState.documentVersion = ajaxResp[DOCVERSION_PARAM];
									//if we are no longer editing, we must have cancelled, so better unlock
									if (!editState.editing) {
										//need to send the undo command
										sendCommand(ajaxResp[STARTRANGE_PARAM], ajaxResp[ENDRANGE_PARAM], CANCELLOCK_COMMAND, editState.documentVersion, "");
										//watch the global flag setting
										clearInPostRequestFlag = false;
									} else {
										debug1('Got OK for lock and still editing.  We are good to go.');
									}
									editState.lockRequestPending = false;
								} else {
									// was a response to something else
									debug1('Got OK response for : ' + ajaxResp[CORRECTOR_COMMAND_PARAM]);
								}
							} else if (ajaxResp[RESPONSE_STATUS_PARAM] == DENY_INDICATOR) {
								// request denied.  Find out what the request was
								// if lock, remove the editbox
								if (ajaxResp[CORRECTOR_COMMAND_PARAM] == LOCK_COMMAND) {
									if (editState.editing) {
										//cancel the edit but don't need to send unlock cuz lock not accepted in the first place
										cancelEdit();
										editState.lockRequestPending = false;
										//don't need to send out cancel if previous lock request denied so put this after cancelEdit.
									} else {
										//not editing so that stuff taken care of.  No cancel needed or previously sent
										editState.lockRequestPending = false;
									}
								} else {
									///////////debug1('Other request denied: ' + str);
									debug1('Other request denied : ' + ajaxResp[CORRECTOR_COMMAND_PARAM]);
									//figure out what to do on request denied for other types of requests
									
								}
							} else {
								//don't know what code came back???
								errorOut('Error of some type:  xmlhttpPost::xmlHttpReq.status=:200, return str =:'+responseStr);
							}

							//ask for immediate polling to update backend
							pollNow();
						}
					} else {
						errorOut('Error of some type - NOT status=200:  xmlhttpPost::xmlHttpReq.status=:'+this.status);
						errorOut('xmlhttpPost::xmlHttpReq.statusText=:'+this.statusText);
					}
				}
				if (clearInPostRequestFlag) {
					inPostRequestFlag = false;
				}
			} else {
				errorOut('not sure what up - ready not 1,2,3 or 4: xmlhttpPost::xmlHttpReq.readyState=:'+this.readyState);
				if (clearInPostRequestFlag) {
					inPostRequestFlag = false;
				}
			}
		} //try
		catch (e) {
			errorOut('Caught Exception on readyState in xmlhttpPost');
			inPostRequestFlag = false;
		}
	}
	/////////////
	inPostRequestFlag = true;
	//clear reset flag so we can tell if system reset while waiting for ajax response
	globalState.resetFlagSet = false;
	xmlHttpReq.send(parameterStr + '&' + CORRECTOR_PWD_PARAM + '=' + userinfo + '&' + CORRECTOR_PARAM + '=' + userInitials + '&' + ROOM_PARAM + '=' + myroomid + '&' + MEETINGDOCID_PARAM + '=' + globalState.meetingDocId);
	debug1 ('xmlhttpPost:: END');
}

//========================================================//
//========================================================//
function xmlhttpPoll(strURL,parameterStr) {
	//alert('ajax:' + parameterStr);
	parameterStr += '&' + CORRECTOR_PARAM + '=' + userInitials + '&' + ROOM_PARAM + '=' + myroomid + '&' + MEETINGDOCID_PARAM + '=' + globalState.meetingDocId;
	//strURL += "?" + parameterStr;
	document.getElementById("meettitle").textContent = "Meeting room: " + myroomid;
	document.getElementById("meetstats").textContent = "Doc ver: " + globalState.documentVersion;
	
	debug1('xmlhttpPoll:: Entered with strURL = :'+strURL+'   parameterStr=:' + parameterStr);
	debug1('xmlhttpPoll:: Entered');

	var MAXIMUM_WAITING_TIME = 15000; //milliseconds
	var request = false;
	var xmlHttpReq = null;
	//var self = this;

	if (window.XMLHttpRequest) {
		try {
			xmlHttpReq = new window.XMLHttpRequest();
		} catch (e) {
			request = false;
		}
	}
	if (!xmlHttpReq) {
		errorOut('xmlhttpPoll:: Cannot create XLMHTTP instance');
		return request;
	}

	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
	}

	//xmlHttpReq.open('GET', strURL, true);	//don't wait
	xmlHttpReq.open('POST', strURL, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait

	/*var requestTimer = setTimeout(function() {
		debug('xmlhttpPoll:: aborting request; timeout reached');
		debug('xmlhttpPoll:: aborting for value='+xmlHttpReq.value);
		lockRequestPending = false;
		xmlHttpReq.abort();
		//tell it was aborted
		}, MAXIMUM_WAITING_TIME);
*/
	xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttpReq.setRequestHeader('Cache-Control', 'no-cache');
	xmlHttpReq.onreadystatechange = function () {
		//////////////
		var pollResponseStr;
		var pollResponse = "";
		//var returnStr = "";
		//debug1("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
		//debug1('onreadystatechange Function START');
		//debug1('xmlhttpPoll::xmlHttpReq callback function running');
		//debug1('xmlhttpPoll:: xmlHttpReq.value='+this.value);
		try {
			if (this.readyState === 1) {
				//debug1('xmlhttpPoll::xmlHttpReq.readyState=:1');
			} 
			else if (this.readyState === 2) {
				//debug1('xmlhttpPoll::xmlHttpReq.readyState=:2');
			}
			else if (this.readyState === 3) {
				//debug1('xmlhttpPoll::xmlHttpReq.readyState=:3');
				//debug1('xmlhttpPoll::xmlHttpReq.responseText3=:'+this.responseText);
			}
			else if (this.readyState === 4) {
				debug1("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
				debug1('xmlhttpPoll::xmlHttpReq.readyState=:4 POLL RESPONSE BEGIN');
				//clearTimeout(requestTimer); //do not abort

				//if client page reset while we were waiting for response, just skip everything
				if (!globalState.resetFlagSet) { 

					if (this.status == 200) {
						
						debug1('xmlhttpPoll::xmlHttpReq.status=:'+this.status);
						debug1('xmlhttpPoll::xmlHttpReq.responseText=:'+this.responseText);
						pollResponseStr = this.responseText;
						if (pollResponseStr.charAt(0) == "{") {
							pollResponse = JSON.parse(pollResponseStr);
						} else {
							var len = parseInt(pollResponseStr,10);
							var len2 = pollResponseStr.indexOf("{");
							len = len2 + len;
							var tmp = pollResponseStr.slice(len2,len);
							pollResponse = JSON.parse(tmp);
							var data = pollResponseStr.slice(len);
							/////////////CurrentPosition = pollResponseStr.substring(tmpIndex+9,tmpIndex2);
						}
						
						//debug1("pollResponseStr: " + pollResponseStr);
						debug1("pollResponse: ");
						debug1(pollResponse);
						
						if ((typeof pollResponse[ADMIN_RESPONSE_STATUS_PARAM]) != "undefined") {
							tmp = pollResponse[ADMIN_RESPONSE_STATUS_PARAM];
							//got some administrative response.  This is not good.  Skip processing
						} else {
							if (globalState.meetingDocId != pollResponse[MEETINGDOCID_PARAM]) {
								//oh-oh. Meeting reset
								resetAndReloadClient( pollResponse[MEETINGDOCID_PARAM] );
							} else if (pollResponse[RESPONSE_STATUS_PARAM] == ACCEPT_INDICATOR) {
							///////////var tmpIndex;
							///////////if ((tmpIndex = pollResponseStr.indexOf("~OK;last=")) != -1) {
							//command accepted.
								/////////////~OK;last=  9
								///////////var tmpIndex2 = pollResponseStr.indexOf('~',tmpIndex+9)
								/////////////CurrentPosition = pollResponseStr.substring(tmpIndex+9,tmpIndex2);
								///////////globalState.documentVersion = pollResponseStr.substring(tmpIndex+9,tmpIndex2);
								///////////pollResponse = pollResponseStr.substring(tmpIndex2+1);
								///////////debug1("pollResponseStr: " + pollResponseStr);
								///////////debug1("pollResponse: " + pollResponse);
								///////////if ((pollResponse != null) && (pollResponse != "")) {
								///////////	client_update(pollResponse);
								///////////	pollResponse = "";
								///////////}
								
								//if check against doc ID we sent
								if (globalState.documentVersion < pollResponse[DOCVERSION_PARAM]) {
									if (data != "") {
										debug1('client_update call');
										client_update(pollResponseStr.slice(len));
										debug1('client_update return');
									}
									globalState.documentVersion = pollResponse[DOCVERSION_PARAM];
									document.getElementById("meetstats").textContent = "Doc ver: " + globalState.documentVersion;
								}
							} else {
								//error of some type???
								errorOut('Error of some type:  xmlhttpPoll::xmlHttpReq.status=:200, pollResponseStr =:'+pollResponseStr);
							}
						}
					} else {
						errorOut('Error of some type - NOT status=200:  xmlhttpPoll::xmlHttpReq.status=:'+this.status);
						errorOut('xmlhttpPoll::xmlHttpReq.statusText=:'+this.statusText);
					}
				}
				inPollRequest = false;
				if (immediatePollRequested == true) {
					debug1('immediatePollRequested in xmlhttpPoll');
					pollNow();
				}
				debug1('POLL RESPONSE END');
				debug1("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
			} else {
				errorOut('not sure what up - ready not 1,2,3 or 4: xmlhttpPoll::xmlHttpReq.readyState=:'+this.readyState);
				inPollRequest = false;
			}
		} //try
		catch (e) {
			errorOut('Caught Exception on readyState in xmlhttpPoll');
			inPollRequest = false;
		}
		//debug1('POLL RESPONSE END');
		//debug1("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
	}
		/////////////
		
	//var myroomid = "<?php echo($roomid); ?>";

	inPollRequest = true;
	immediatePollRequested = false;
	globalState.resetFlagSet = false;
	xmlHttpReq.send(parameterStr);
	//xmlHttpReq.send();
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug1 ('xmlhttpPoll:: END');
}

// end of editing scripting password authentication 
////////////////////////
////////////////////////
////////////////////////

/* old code for when using comet method 

function cleanUpIframe(idOfRunningScript) {

	var KEEP_ELEMENTS = 6;
	var i, j;
	var iframe = document.getElementById("comet_iframe");
	var iframewindow= iframe.contentWindow? iframe.contentWindow : iframe.contentDocument;
	
	var keepNode = iframewindow.document.getElementById("js");
	var nodeList = keepNode.parentNode.childNodes;

	var arr = Array.prototype.slice.call(nodeList);
	
	for (i = arr.indexOf(keepNode) + 1, j = arr.indexOf(iframewindow.document.getElementById(idOfRunningScript)) - KEEP_ELEMENTS; i < j; j--) {
		keepNode.parentNode.removeChild(nodeList.item(i));
	}
}

var readingPreviousCaptions = false;

var heartbeatTimer;
var lastCheckIn = 0;
var lastCleanup = 0;


function processPreviousCaptions(fId, tmpCount, tmpStr) {
	var tmpIDNum = globalSpanIDCounter;
	readingPreviousCaptions = true;
	comet_update(fId, tmpCount, tmpStr);
	if (globalSpanIDCounter != tmpIDNum + parseInt(tmpCount,10)) {
		//there is an error here.
		//alert("Server [" + tmpCount + "] and Client [" + (globalSpanIDCounter - tmpIDNum) + "] disagree on word counts!");
	}
	readingPreviousCaptions = false;
}


function  startHeartbeat() {
	heartbeatTimer = setTimeout(function() {
		alert("Comet connection lost. Last check-in at: [" + lastCheckIn + "].  Refresh browser to reconnect");
		//tell it was aborted
		}, 1000 * 30);
}


function hbCheck(id, lTime) {
	//heartbeat checking
	if (lastCheckIn == 0) {
		lastCheckIn = lTime+1;  //+1 just to make sure lastCheckIn not 0 anymore
	} else {
		//stop timer
		clearInterval(heartbeatTimer);
		
		//clean up iFrame periodically
		if ((lTime - lastCleanup) > (1000*60)) {
			cleanUpIframe(id);
			lastCleanup = lTime;
		}
		lastCheckIn = lTime;
	}
	//start timer
	startHeartbeat();
}
*/


/*

	var fragElem = document.createDocumentFragment();
	
	function getFragElementById(elemID) {
	var nodeList = null;
	var elem = null;
	
	if (nodeList = fragElem.childNodes) {
		for (var i = nodeList.length; i--;) {
			if (nodeList[i].id == elemID) {
				elem = nodeList[i];
				break;
			}
		}
	}
	return elem;
}

*/
//========================================================//
//========================================================//
function client_update(dataStr) {

	debug("client_update::dataStr before decode : ["+dataStr + "]");
	
//	var startTime = new Date().getTime();
//	debug("Start = " + startTime);
//	var diff;
//	var endTime;

	//captionContentNode = document.getElementById('f1capcontent');
	//captionContentNode = document.getElementById("doccontent");
	
	var command = "";
	var aSpan;
	var tmpSpan;
	
	var curPara;
	var tempPara;
	
	var tmpTxt = "";
	var localTmpTxt;

	var startRange = 0;
	var endRange = 0;
	var correction = "";
	var correctorInitials = "";
	
	var commandFields;
	var dataFields;
	var tmpCommand = "";
	var tmpChar;
	
	//get array of commands
	var capcorArray = dataStr.split("\n");
	var capcorArrayLength = capcorArray.length;
	
	for (var i = 0; i < capcorArrayLength; i++) {
		//strip off leading and trailing spaces  (white spaces?)
		tmpCommand = capcorArray[i];
		tmpCommand = tmpCommand.replace(/^\s+|\s+$/g,'');
		if (tmpCommand == "") {
			//move on to next
			continue;
		}
		
		//break up fields of the command
		commandFields = tmpCommand.split("~");
		
		//make sure all the pieces are there
		if (commandFields.length < 2) {
			debug("Received an invalid correction request from server. <2 fields");
			continue;
		}
		
		command = commandFields[0]; 
		
		//======================//
		if (command == CAPTION_COMMAND) {
			try {
				if (commandFields.length != 3) {
					throw ("Received an invalid correction request from server. <3 fields");
				} else {
					//pass id and encoded caption;
					captionAdd(commandFields[1], commandFields[2]);
				}
			} catch (e) {
				errorOut("Error in CAPTION_COMMAND. ID=[" + commandFields[1] + "]  caption=[" + commandFields[2] + "]\n" + e);
			}
		//======================//
		
		
		//======================//
		} else if (command == CAPTION_RECALL_COMMAND) {
			try {
				captionRecall(commandFields[1]);
			} catch (e) {
				errorOut("Error in CAPTION_RECALL_COMMAND. start=[" + commandFields[1] + "]\n" + e);
			}
		//======================//
		
		
		//======================//
		} else if (command == CAPTIONER_PARAGRAPH_COMMAND) {
			try {
				paragraphAdd(commandFields[1]);
			} catch (e) {
				errorOut("Error in CAPTIONER_PARAGRAPH_COMMAND. start=[" + commandFields[1] + "]\n" + e);
			}
		//======================//
		
		
		//======================//
		} else if (command == CAPTIONER_PARAGRAPH_RECALL_COMMAND) {
			try {
				paragraphRecall(commandFields[1]);
			} catch (e) {
				errorOut("Error in CAPTIONER_PARAGRAPH_RECALL_COMMAND. start=[" + commandFields[1] + "]\n" + e);
			}
		//======================//
		
		
		//======================//

		} else {
		
			//make sure all the pieces are there
			if (commandFields.length < 5) {
				debug("Received an invalid correction request from server. <5 fields");
				return;
			}
			//let's break it down to make it easier
			startRange = parseInt(commandFields[1],10);  //start
			endRange = parseInt(commandFields[2],10);     //end
			correction = commandFields[3];
			if ((correction != null) & (correction != "") ) {
				correction = decodeURIComponent(correction);
			} else {
				correction = "";
			}
			debug("client_update::command [" + command + "] dataStr after decode : "+correction);
			
			correctorInitials = commandFields[4];//initials

			//WONT WORK FOR PARAGRAPH DELETE...FIX  update: did fix i think
			// need to check if we are editing and a correction comes in that affects the editing process
			//will kick us out of edit if it overlaps our edit, unless it is our lock command
			checkForEditInterference(command, startRange, endRange, correctorInitials);
			
			
			// now apply the correction
			
				/////////////////////////////////////////////
			if (command==LOCK_COMMAND) {
				try {
					// it is a lock request - no stale edit check here, just apply
					//update global unique lock id
					globalState.lockId++;
					lockUpdate(startRange, endRange, correctorInitials,globalState.lockId);
				} catch (e) {
					errorOut("Error in LOCK_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}

			///////////////////////////////////
			} else if (command == EDIT_COMMAND) {
				try {
					//It is a correction - also handles unlocks and tooltips and restore
					applyEditToRange(startRange, endRange, correction.replace(/^\s+|\s+$/g,'') + " ", correctorInitials);
					//ifRestoredToOriginalTextResetSpanRange(startRange, endRange);
				} catch (e) {
					errorOut("Error in EDIT_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]  correction=[" + correction + "]\n" + e);
				}

			///////////////////////////////////////////////////////////////////////////////
			} else if ((command==CANCELLOCK_COMMAND) || (command==OVERRIDE_COMMAND)) {
				try {
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in CANCELLOCK_COMMAND / OVERRIDE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			///////////////////////////////////////////////////////////////////////////////
			} else if (command==RESTORE_COMMAND) {
				try {
//					//check if edit is stale before applying
//					aSpan = document.getElementById(startRange);
//					if ((aSpan != null) && (aSpan.firstChild != null)) {
//						if (checkForPossibleStaleEditEnd(endRange) == 1) {

							//should handle unlocks
							restoreRange(startRange,endRange);
//						}
//					}
				} catch (e) {
					errorOut("Error in RESTORE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==DELETEALL_COMMAND) {
				try {
//					//before applying new edit... check if stale range
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
//						//not stale.  Apply
						//handles unlocks, restore, tooltips
						applyEditToRange(startRange, endRange, "", correctorInitials);
//					} else {
//						//was stale - do not apply.  Simply remove locks
//						//and set all background of the span objects back to their previous state.
//						unlockRange(startRange,endRange);
//					}
				} catch (e) {
					errorOut("Error in DELETEALL_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==COMMA_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					
//					//check if edit is stale before applying
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {

					// add comma unless a comma already exists
					if (((aSpan = document.getElementById(startRange)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						//should never have an empty span
						if (tmpTxt.length <= 1) {
							//this shouldn't happen normally but deal with it
							//if char is a space or a comma, make it right
							if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == ',')) {
								aSpan.textContent = ", ";
							} else {
								aSpan.textContent = tmpTxt + ", ";
							}
							//set flags, editor and style to indicate this was a quickclick
							setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
							//checkIfRestoredToOriginal(startRange,endRange);
						} else {
							localTmpTxt = tmpTxt;
							//replace ?!. with the comma
							localTmpTxt = localTmpTxt.replace(/[\?\!\.,]\s*$/,", ");
							if (localTmpTxt.charAt(localTmpTxt.length-2) != ',') {
								//append
								localTmpTxt = localTmpTxt.replace(/\s*$/,", ");
							}
							//now see if there was a change
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in COMMA_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}

			////////////////////////////////////////////////////////////////////////////////
			} else if ((command==PERIOD_COMMAND) || (command==QUESTION_COMMAND)) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range

					//
					//check if edit is stale before applying
//					//Find out if we are applying a capitalization or not.  This will affect stale check
//					if (((correction == "cap") && (checkForPossibleStaleEditWithEndNotEmpty(startRange,endRange) == 1)) 
//							|| ((correction == "") && (checkForPossibleStaleEdit(startRange, endRange) == 1)) ) {
//						//edit is not stale so good to apply
						
						//if PERIOD_COMMAND, and text ends in question mark, change it to period and capitalize next word
						//if QUESTION_COMMAND and ends in a period, change to question mark and capitalize next word
						
						//startRange is span id of span clicked on
						//endRange is span id of last span in edit group of either the span clicked on or span to be capitalized
						//correction holds span id of span to be capitalized

					if (((aSpan = document.getElementById(startRange)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						if (tmpTxt.length <= 1) {
							//this shouldn't happen but deal with it
							//if char is a space or a period, make it right.  Replace a question mark with a period or vice-versa
							if (command==PERIOD_COMMAND) {
								localTmpTxt = ". ";
							} else {
								localTmpTxt = "? ";
							}
							if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.') || (tmpTxt.charAt(0) == '?')) {
								aSpan.textContent = localTmpTxt;
							} else {
								aSpan.textContent = tmpTxt + localTmpTxt;
							}
							//set flags, editor and style to indicate this was a quickclick
							setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
							//checkIfRestoredToOriginal(startRange,getEndOfEditGroup(startRange,false));

						} else {
							localTmpTxt = tmpTxt;
							if (command==PERIOD_COMMAND) {
								//replace ?!, with the period
								localTmpTxt = localTmpTxt.replace(/[\?\!\.,]\s*$/,". ");
								if (localTmpTxt.charAt(localTmpTxt.length-2) != '.') {
									//append the period 
									localTmpTxt = localTmpTxt.replace(/\s*$/,". ");
								}
							} else { //if (command==QUESTION_COMMAND) {
								//replace .!,  with a question mark
								localTmpTxt = localTmpTxt.replace(/[\?\!\.,]\s*$/,"? ");
								if (localTmpTxt.charAt(localTmpTxt.length-2) != '?') {
									//append the question mark 
									localTmpTxt = localTmpTxt.replace(/\s*$/,"? ");
								}
							}
							//now see if there was a change
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,getEndOfEditGroup(startRange,false));
							}
						}
					}
					
					//now see if we need to capitalize a word
					if (correction != "") {
						correction = parseInt(correction,10);
						if (((aSpan = document.getElementById(correction)) != null) && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
							tmpTxt = aSpan.textContent;
							if (tmpTxt != "") {
								localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = localTmpTxt;
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
									//checkIfRestoredToOriginal(correction,endRange);
								}
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in PERIOD_COMMAND / QUESTION_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}

			////////////////////////////////////////////////////////////////////////////////
			} else if (command==CAPITALIZE_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						if (tmpTxt != "") {
							localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in CAPITALIZE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==LOWERCASE_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						if (tmpTxt != "") {
							localTmpTxt = tmpTxt.charAt(0).toLowerCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in LOWERCASE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==REMOVEPUNCTUATION_COMMAND) {
				try {
					//no need to worry about locks....it would have been ignored or rejected if locked.
					//(as long as all affected spans in range
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						localTmpTxt = tmpTxt.replace(/[\?\.,\!;:]\s$/," ");
						if (localTmpTxt != tmpTxt) {
							//content changed
							//see if we have removed all text
							if (localTmpTxt.replace(/\s+$/,"") == "") {
								//nothing left, treat as a deleteall
								applyEditToRange(startRange, endRange, "", correctorInitials);
							} else {
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(startRange,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in LOWERCASE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
	/*
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==PARADELETE_COMMAND) {
				//note newspeaker will be removed by default if it exists on next paragraph
				//startRange holds id of last edit group before paragraph break
				//endRange holds either end of startRange edit group, or end of first edit group after para break
				try {
					if (((aSpan = document.getElementById(startRange)) != null) ) {
						if ((curPara = aSpan.parentNode) != null) {
							if ((tempPara = curPara.nextSibling) != null) {
								//never delete captioner paragraph, so double check
								if (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
									//okay, ready to go.  Start moving from tempPara to curPara
									aSpan = tempPara.firstChild;
									while (aSpan != null) {
										//get ptr to next sib before we lose it
										tmpSpan = aSpan.nextSibling;
										//move the aSpan one
										curPara.appendChild(aSpan);
										//update aSpan to next sib
										aSpan = tmpSpan;
									}
									//delete tempPara
									curPara.parentNode.removeChild(tempPara);
								} else {
									//next para was not special.  Remove attribute since it is wrong
									curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
								}
							} else {
								//no following paragraph so remove attribute if any
								curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
							}
						}
					}
					//if we didn't have startRange id, see if we have endRange id
					//is so, 
									
					//okay, do we have a special again?
					tempPara = curPara.nextSibling;
					if ((tempPara != null) && (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null)) {
						if (tempPara.getAttribute(NEWSPEAKER_ATTR) != null) {
							//add attribute on cur
							curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
						} else {
							//add attribute on cur
							curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
						}
					} else {
						//remove attribute (if any)
						curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
					}

					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in PARADELETE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
	*/
	
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==PARADELETE_COMMAND) {
				//note newspeaker will be removed by default if it exists on next paragraph
				//startRange holds id of last edit group before paragraph break
				//endRange holds either end of startRange edit group, or end of first edit group after para break
				try {
					if (((aSpan = document.getElementById(startRange)) != null) ) {
						curPara = aSpan.parentNode;
						if (curPara != null) {
							tempPara = curPara.nextSibling;
							if (tempPara != null) {
								//never delete captioner paragraph, so double check
								if (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
									//okay, ready to go.  Start moving from tempPara to curPara
									aSpan = tempPara.firstChild;
									while (aSpan != null) {
										//get ptr to next sib before we lose it
										tmpSpan = aSpan.nextSibling;
										//move the aSpan one
										curPara.appendChild(aSpan);
										//update aSpan to next sib
										aSpan = tmpSpan;
									}
									
									//delete tempPara
									curPara.parentNode.removeChild(tempPara);
									
									
									//okay, do we have a special again?
									tempPara = curPara.nextSibling;
									if ((tempPara != null) && (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null)) {
										if (tempPara.getAttribute(NEWSPEAKER_ATTR) != null) {
											//add attribute on cur
											curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
										} else {
											//add attribute on cur
											curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
										}
									} else {
										//remove attribute (if any)
										curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
									}
								} else {
									//next para was not special.  Remove attribute since it is wrong
									curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
								}
							} else {
								//no following paragraph so remove attribute if any
								curPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
							}
						}
					}
					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in PARADELETE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
	
	
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==SPEAKEREDIT_COMMAND) {
				try {
					//should check if this is a newspeaker paragraph by looking for marking attribute
					if (((aSpan = document.getElementById(startRange)) != null) ) {
						//Get parent
						tempPara = aSpan.parentNode;
						if (tempPara.getAttribute(NEWSPEAKER_ATTR) != null) {
							//update text
							tmpTxt = correction.replace(/^\s+|\s+$/g,'');
							tempPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, tmpTxt + " ");
							//unhide it
							tempPara.setAttribute(NEWSPEAKER_ATTR,SHOWSPEAKER_TEXT);
						}
					}
					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in SPEAKEREDIT_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==SPEAKERDELETE_COMMAND) {
				try {
					//use endRange as we know this will be on relevent paragraph
					if (((aSpan = document.getElementById(endRange)) != null) ) {
						//Get parent
						if ((tempPara = aSpan.parentNode) != null) {
							//don't bother to check if attributes there, just remove
							tempPara.removeAttribute(SPEAKER_TEXT_FIELD_ATTR);
							tempPara.removeAttribute(NEWSPEAKER_ATTR);
							
							//are we a special paragraph
							if (tempPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
								//yes we are.
								//restore previous paragraph mark tp standard form
								if ((tempPara = tempPara.previousSibling) != null) {
									tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
								}
							}
						}
					}
					//clear locked indicator
					unlockRange(startRange,endRange);
				} catch (e) {
					errorOut("Error in SPEAKERDELETE_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
				

			////////////////////////////////////////////////////////////////////////////////
			} else if ((command==NEWSPEAKER_COMMAND) || (command==PARAGRAPH_COMMAND)) {
				try {
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
						//if (((aSpan = document.getElementById(startRange)) != null) ) {
						
					//startRange is span id of word before span clicked on
					//endRange is span id of last span in edit group of span clicked on
					//correction holds span id of span clicked on
					if ((correction != "") && ((aSpan = document.getElementById(correction)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
						//create new paragraph, but only if span not first in paragraph
						//NOTE: if someone joins late it might be ther first in paragraph.  For others, it is not so we 
						//need to handle this correctly
						
						curPara = aSpan.parentNode;
						if (curPara.firstChild !== aSpan) {
							//create the new paragraph
							tempPara = document.createElement("p");
							//tag to indicate it was a corrector-added paragraph
							tempPara.setAttribute(CORRECTORPARA_ATTRIBUTE, "true");
							//now go through the spans appending them to their new parent paragraph
							//ie moving from original paragraph to tempPara
							while (aSpan != null) {
								//get ptr to next sib before we lose it
								tmpSpan = aSpan.nextSibling;
								//move the aSpan one
								tempPara.appendChild(aSpan);
								//update aSpan to next sib
								aSpan = tmpSpan;
							}
							//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  
							curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);
							curPara = tempPara;  //update for later use
							
							//apply punctuation if we have the span.  Don't worry about it if we don't have the span
							//convert correction to number
							correction = parseInt(correction,10);

							//apply punctuation to previous word...(only on new paragraph)
							//Make sure there is a previous word
							if ((correction != startRange) && ((aSpan = document.getElementById(startRange)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
								tmpTxt = aSpan.textContent;
								if (tmpTxt.length == 1) {
									//this shouldn't happen but deal with it
									if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.')) {
										aSpan.textContent = ". ";
									} else if (tmpTxt.charAt(0) == '?') {
										aSpan.textContent = "? ";
									} else if (tmpTxt.charAt(0) == '!') {
										aSpan.textContent = "! ";
									} else {
										aSpan.textContent = tmpTxt + ". ";
									}
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
									//checkIfRestoredToOriginal(startRange,getEndOfEditGroup(startRange,false));

								} else {
									localTmpTxt = tmpTxt;
									//if certain chars at end, don't modify.  Otherwise add a period
									localTmpTxt = localTmpTxt.replace(/([^\?\.,\!:;\s])\s*$/,"$1. ");
									////tmpChar = localTmpTxt.charAt(localTmpTxt.length-2);
									//if ((tmpChar != '.') && (tmpChar != '?') && (tmpChar != '!')) {
									//	//append the period 
									//	localTmpTxt = localTmpTxt.replace(/\s$/,". ");
									//}
									//now see if there was a change
									if (localTmpTxt != tmpTxt) {
										//content changed
										aSpan.textContent = localTmpTxt;
										//set flags, editor and style to indicate this was a quickclick
										setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
										//checkIfRestoredToOriginal(startRange,getEndOfEditGroup(startRange,false));
									}
								}
							}
						}
						//okay tag paragraphs appropriately
							
						if (command == NEWSPEAKER_COMMAND) {
							//mark it
							curPara.setAttribute(NEWSPEAKER_ATTR,SHOWSPEAKER_TEXT);
							//set attribute for text to display on newspeaker paragraph
							curPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, NEW_SPEAKER_TEXT);
						
							//put special paragraph marking on previous paragraph (if exists) to indicate a corrector-generated paragraph follows
							if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
								//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
								if ((tempPara = curPara.previousSibling) != null) {
									tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
								}
							}
						} else {
							//put special paragraph marking on previous paragraph (if exists) to indicate a corrector-generated paragraph follows
							if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
								//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
								if ((tempPara = curPara.previousSibling) != null) {
									curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
								}
							}
						}

						//capitalize word we clicked on
						aSpan = document.getElementById(correction);
						tmpTxt = aSpan.textContent;
						if (tmpTxt != null) {
							localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = localTmpTxt;
								//set flags, editor and style to indicate this was a quickclick
								setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								//checkIfRestoredToOriginal(correction,endRange);
							}
						}
					}
//					}
				} catch (e) {
					errorOut("Error in NEWSPEAKER_COMMAND/NEWPARAGRAPH command. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
	/*		
			////////////////////////////////////////////////////////////////////////////////
			} else if ((command==NEWSPEAKER_COMMAND) || (command==PARAGRAPH_COMMAND)) {
				try {
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
						//if (((aSpan = document.getElementById(startRange)) != null) ) {
						
						//startRange is span id of word before span clicked on
						//endRange is span id of last span in edit group of span clicked on
						//correction holds span id of span clicked on
						if ((correction != "") && ((aSpan = document.getElementById(correction)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
							//create new paragraph, but only if span not first in paragraph
							//NOTE: if someone joins late it might be first in paragraph.  For others, it is not
							
							curPara = aSpan.parentNode;
							if (curPara.firstChild !== aSpan) {
								//create the new paragraph
								tempPara = document.createElement("p");
								//tag to indicate it was a corrector-added paragraph
								tempPara.setAttribute(CORRECTORPARA_ATTRIBUTE, "true");
								if (command == NEWSPEAKER_COMMAND) {
									//mark it
									tempPara.setAttribute(NEWSPEAKER_ATTR,SHOWSPEAKER_TEXT);
									//set attribute for text to display on newspeaker paragraph
									tempPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, NEW_SPEAKER_TEXT);
									//put special paragraph marking on curPara to indicate a corrector-generated paragraph follows
									curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
								} else {
									//put special paragraph marking on curPara to indicate a corrector-generated paragraph follows
									curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
								}
								//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  
								curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);
								
								//convert correction to number
								correction = parseInt(correction,10);

								//capitalize word while we have it...(only on new paragraph)
								tmpTxt = aSpan.textContent;
								if (tmpTxt != null) {
									localTmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
									if (localTmpTxt != tmpTxt) {
										//content changed
										aSpan.textContent = localTmpTxt;
										//set flags, editor and style to indicate this was a quickclick
										setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
										//checkIfRestoredToOriginal(correction,endRange);
									}
								}

								//now go through the spans appending them to their new parent paragraph
								//ie moving from original paragraph to tempPara
								while (aSpan != null) {
									//get ptr to next sib before we lose it
									tmpSpan = aSpan.nextSibling;
									//move the aSpan one
									tempPara.appendChild(aSpan);
									//update aSpan to next sib
									aSpan = tmpSpan;
								}
								
								//apply punctuation to previous word...(only on new paragraph)
								//Make sure there is a previous word
								if ((correction != startRange) && ((aSpan = document.getElementById(startRange)) != null)  && (!spanIsMarkedTextDeleted(aSpan)) && (aSpan.firstChild != null) ) {
									tmpTxt = aSpan.textContent;
									if (tmpTxt.length == 1) {
										//this shouldn't happen but deal with it
										if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.')) {
											aSpan.textContent = ". ";
										} else if (tmpTxt.charAt(0) == '?') {
											aSpan.textContent = "? ";
										} else if (tmpTxt.charAt(0) == '!') {
											aSpan.textContent = "! ";
										} else {
											aSpan.textContent = tmpTxt + ". ";
										}
										//set flags, editor and style to indicate this was a quickclick
										setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
										//checkIfRestoredToOriginal(startRange,getEndOfEditGroup(startRange,false));
										

									} else {
										localTmpTxt = tmpTxt;
										//if certain chars at end, don't modify.  Otherwise add a period
										localTmpTxt = localTmpTxt.replace(/([^\?\.,\!:;\s])\s*$/,"$1. ");
										////tmpChar = localTmpTxt.charAt(localTmpTxt.length-2);
										//if ((tmpChar != '.') && (tmpChar != '?') && (tmpChar != '!')) {
										//	//append the period 
										//	localTmpTxt = localTmpTxt.replace(/\s$/,". ");
										//}
										//now see if there was a change
										if (localTmpTxt != tmpTxt) {
											//content changed
											aSpan.textContent = localTmpTxt;
											//set flags, editor and style to indicate this was a quickclick
											setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
											//checkIfRestoredToOriginal(startRange,getEndOfEditGroup(startRange,false));
										}
									}
								}

							} else {
								if (command == NEWSPEAKER_COMMAND) {
									//mark it
									curPara.setAttribute(NEWSPEAKER_ATTR,SHOWSPEAKER_TEXT);
									//set attribute for newspeaker text to display on paragraph
									curPara.setAttribute(SPEAKER_TEXT_FIELD_ATTR, NEW_SPEAKER_TEXT);
									//if this paragraph a corrector paragraph, change form of paragraph marker
									if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
										//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
										if ((tempPara = curPara.previousSibling) != null) {
											tempPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_PLUS_MARK);
										}
								}
							}
						}
//					}
				} catch (e) {
					errorOut("Error in NEWSPEAKER_COMMAND/NEWPARAGRAPH command. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
	*/
			////////////////////////////////////////////////////////////////////////////////
			/*
			} else if (command==NEWSPEAKER_COMMAND) {
				try {
					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
						if (((aSpan = document.getElementById(startRange)) != null) ) {
							
							//create the new paragraph
							var tempPara = document.createElement("p");
							//get current paragraph - we will insert the new para after this current para (but more complex than that - see below)
							var curPara = aSpan.parentNode;
							//use the id of the current para to construct the id for the new para
							tempPara.setAttribute("id",curPara.getAttribute("id") + "a" + globalState.clientGeneratedParagraphCnt++);
							//tag to indicate it was a user added paragraph
							//associate it with the last captioner paragraph
							tempPara.setAttribute("mypara", curPara.getAttribute("id"));
							//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  if null, puts at end
							curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);
							//now detach the span(s) from old para and attach to new para
							//point to first node that needs to move

							//capitalize it while we have it...
							tmpTxt = aSpan.textContent;
							if (tmpTxt != null) {
								var localTmpTxt = tmpTxt;
								//tmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
								tmpTxt = "SPEAKER: " + tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = tmpTxt;
									if (!spanIsMarkedEdited(aSpan)) {
										setSpanEdited(aSpan, localTmpTxt);
									} //else already edited and saved
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,correctorInitials);
								}
							}
							//now go through the spans appending them to their new parent paragraph
							var tmpSpan;
							while (aSpan != null) {
								//get ptr to next sib before we lose it
								tmpSpan = aSpan.nextSibling;
								//move this sib
								tempPara.appendChild(aSpan);
								//update to next sib
								aSpan = tmpSpan;
							}
						}
					}
				} catch (e) {
					debug("Error in NEWSPEAKER_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]");
				}
				*/
////////////////////////////////////////////////////////////////////////////////
/*
			} else if (command==PARAGRAPH_COMMAND) {
				try {
//					if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
						if (((aSpan = document.getElementById(startRange)) != null) ) {
							//capitalize word while we have it...
							tmpTxt = aSpan.textContent;
							if (tmpTxt != null) {
								localTmpTxt = tmpTxt;
								localTmpTxt = localTmpTxt.charAt(0).toUpperCase() + localTmpTxt.slice(1);
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = localTmpTxt;
									//set flags, editor and style to indicate this was a quickclick
									setSpanQuickClicked(aSpan,command,correctorInitials,tmpTxt);
								}
							}
							
							//create new paragraph, but only if span not first in paragraph
							curPara = aSpan.parentNode;
							if (curPara.firstChild !== aSpan) {

							tempPara = document.createElement("p");
							//tag to indicate it was a correcotr-added paragraph
							tempPara.setAttribute(CORRECTORPARA_ATTRIBUTE, "true");

							//put special paragraph marking on curPara to indicate a corrector-generated paragraph follows
							curPara.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,"newparagraph");
							//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  if null, puts at end
							curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);

								//now go through the spans appending them to their new parent paragraph
								//ie moving from original paragraph to tempPara
							while (aSpan != null) {
								//get ptr to next sib before we lose it
								tmpSpan = aSpan.nextSibling;
								//move this sib
								tempPara.appendChild(aSpan);
								//update to next sib
								aSpan = tmpSpan;
							}
						}
//					}
				} catch (e) {
					debug("Error in PARAGRAPH_COMMAND. start=[" + startRange + "]  end=[" + endRange + "]\n" + e);
				}
*/

			} else {
				errorOut("Received an invalid correction request from server: " + command);
			}
		}
	}
	debug("done with client_update");
	/*
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		if (styleElem.cssRules[i].selectorText == ".caption") {
			styleElem.cssRules[i].style.visibility = "visible";
			break;
		}
	}
	*/
	
		///////////////////////////////////
	//var formF1 = F1Node;
	//var F1ParentDiv = formF1.parentNode;  //"capcontent"
	//F1ParentDiv.appendChild(formF1);
	

	
	
//	endTime = new Date().getTime();
//	diff = endTime - startTime;
//	debug("endTime = " + endTime);
//	debug("Diff = " + diff);

	return; 
}

//========================================================//
//========================================================//
function setTooltipText(start, end) {

	var j;
	var toolTipEditor;
	var aSpan;
	var accumulatedOriginalText = "";
	
	//if we don't have first span, skip cuz nothing to put tooltip on
	if ((aSpan = document.getElementById(start)) != null) {
		accumulatedOriginalText += getOriginalSpanText(aSpan);
		toolTipEditor = getSpanEditor(aSpan);
	
		for (j = start+1; j <= end; j++) {
			if ((aSpan = document.getElementById(j)) != null) {
				accumulatedOriginalText += getOriginalSpanText(aSpan);
			}
		}
		//set tool tip on First/master span
		document.getElementById(start).setAttribute(TOOLTIP_ATTRIBUTE, toolTipEditor + " // " + accumulatedOriginalText);
	}
}

//========================================================//
//========================================================//
function checkIfRestoredToOriginal(start, end) {
	//ON HOLD FOR NOW.  NEEED TO DEAL WITH LATE ARRIVALS TO MEETING I.E. NOT PLAYING WITH A FULL DOC

	/*check whole span range, e.g. in applying an edit to a range of spans.  If text matches the concat of all span's original text, then  restore all the spans.
	*/
	var j;
	var text;
	var toolTipEditor;
	var aSpan;
	var accumulatedOriginalText = "";
	var tmpText;
	var done = false;
	
	if ((aSpan = document.getElementById(start)) != null) {
		tmpText = getOriginalSpanText(aSpan);
		if (tmpText != null) {
			accumulatedOriginalText = tmpText;
			text = aSpan.textContent;
			toolTipEditor = getSpanEditor(aSpan);

			for (j = start+1; j <= end; j++) {
				if ((aSpan = document.getElementById(j)) != null) {
					tmpText = getOriginalSpanText(aSpan);
					if (tmpText != null) {
						accumulatedOriginalText += tmpText;
					} else {
						//not been edited - not sure what up here so just quit trying to restore
						done = true;
						break;
					}
				} else {
					done = true;
					break;
				}
			}
			if (!done && (text == accumulatedOriginalText)) {
				//restore spans
				restoreRange(start,end);
			} else {
				//set tool tip on first/master span
				document.getElementById(start).setAttribute(TOOLTIP_ATTRIBUTE,  accumulatedOriginalText  + "[" + toolTipEditor + "]");
			}
		} //else nothing to do
	}
}

/*
//========================================================//
//========================================================//
function ifRestoredToOriginalTextResetSpan(elem) {
	//only dealing with a single span here. If the span is part of an edit group, don't restore
	
	var id = elem.getAttribute("id");
	var text;
	var tmpElem;
	
	if ((elem != null) && ((text = elem.textContent) != null) && (text == getOriginalSpanText(elem))) {
		//we are back at original text. If this is not part of an edit group, treat as a restore
		if (((aSpan = elem.nextSibling) == null) || (aSpan.id == editState.editBoxId) || (aSpan.firstChild != null)) {
			//we are not part of edit group
			//create new span
			tmpElem = document.createElement("span");
			//put text in new span
			tmpElem.appendChild(document.createTextNode(text));
			//insert new span
			elem.parentNode.insertBefore(tmpElem, elem);
			//remove old span
			tmpElem.parentNode.removeChild(elem);
			//set id of new span
			tmpElem.setAttribute("id",id);
		}
	}
}
*/

//========================================================//
//========================================================//
function captionAdd(nodeID, caption) {
//assume captions will only come in at end of document

	var aSpan;
	var tmpEl;
	var tmpId;
	var contentNode = document.getElementById("doccontent");
//	//cancel our edit if nodeID < any span id within the edit group  -not sure how this could happen
//	//Should have gotten a recall that handled this prior

	//if span with this id exists, what should we do with it?
	if ((aSpan = document.getElementById(nodeID)) != null) {
		//This is probably an error.  So let's make the best of it... by dumping everything after
		
		//Cancel our edit if nodeID <= any span id within the edit 
		checkForEditOverlapWithCaptions(nodeID);
		//Remove any paragraphs after span,.
		while ((tmpEl = aSpan.parentNode.nextSibling) != null) {
			contentNode.removeChild(tmpEl);
		}
		
		//Remove any pseudo-element attribute flags cuz, we'll be deleting that paragraph
		aSpan.parentNode.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
		
		//next delete nextSibling of span -- make sure any subsequent spans removed and this span is last
		while ((tmpEl = aSpan.nextSibling) != null) {
			aSpan.parentNode.removeChild(tmpEl);
		}
		//finally, remove this span
		aSpan.parentNode.removeChild(aSpan);
	}

	aSpan = document.createElement("span");
	aSpan.setAttribute("id",nodeID);
	aSpan.appendChild(document.createTextNode(decodeURIComponent(caption) + " "));
	contentNode.lastChild.appendChild(aSpan);
}


//========================================================//
//========================================================//
function captionRecall(nodeID) {
	
	var aSpan;
	var tmpElem;
	var parElem;
	var contentNode = document.getElementById("doccontent");
	
	//if we don't have this span then make sure we have NO spans.  Either just joined or something messed up.
	if ((aSpan = document.getElementById(nodeID)) == null) {
		/*
		//clear and reset any possible edit and parameters
		if ((aSpan = getEditNode()) != null) {
			//clear this so no additional cancels come in
			clearInputEventHandlers(aSpan);
		}
		if (waitingToConfirmEdit()) {
			removeDialog1();
		}
		clearEditState();

		//remove all children of content Node
		do {
			contentNode.removeChild(contentNode.firstChild);
		} while (contentNode.firstChild != null);
		
		//start fresh with new P0 paragraph
		aSpan = document.createElement("p");
		aSpan.setAttribute("id","P0");
		contentNode.appendChild(aSpan);
		*/
	} else {
		//check if backing into a span that has been or is currently being edited
		//If so, restore span and other affected spans before doing the recall
		//Also, unlock range if bumped into a lock.
		//need to update aSpan because restore might have created new element

		aSpan = checkAndRestoreCaptionRecallEnvironment(nodeID);
		
		//okay, now we are good to recall...
		
		//first delete next-sibs paragraphs of parent --removes any paragraphs, esp corrector-added paragraphs after span
		parElem = aSpan.parentNode;
		while ((tmpElem =parElem.nextSibling) != null) {
			contentNode.removeChild(tmpElem);
		}
		
		//Remove any pseudo-element attribute flags cuz no paragraphs after
		parElem.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);

		//next delete next sibling of span -- make sure any subsequent spans removed and this span is last
		while ((tmpElem = aSpan.nextSibling) != null) {
			parElem.removeChild(tmpElem);
		}
		//finally, delete this span
		parElem.removeChild(aSpan);
		
		//now if this was the last span of the last paragraph and now the paragraph is empty, reset paragraph cuz no span to associate with a newspeaker (if one)
		if (parElem.firstChild == null) {
			parElem.removeAttribute(NEWSPEAKER_ATTR);
			parElem.removeAttribute(SPEAKER_TEXT_FIELD_ATTR);
			if (parElem.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
				//put special paragraph marking on previous paragraph to indicate a corrector-generated paragraph follows
				if ((parElem = parElem.previousSibling) != null) {
					parElem.setAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE,PARAGRAPH_MARK);
				}
			}
		}
	}
}

//========================================================//
//========================================================//
function paragraphAdd(nodeID) {

	var contentNode = document.getElementById("doccontent");

	//right now assume will always be added at the end
	var tempPara = document.createElement("p");
	tempPara.setAttribute("id",nodeID); 
	contentNode.appendChild(tempPara);
}

//========================================================//
//========================================================//
function paragraphRecall(nodeID) {

	var aPara;
	var tmpEl;
	var contentNode = document.getElementById("doccontent");

	//if we don't have this paragraph then make sure we have NO paragraphs.  Either just joined or something messed up.
	if ((aPara = document.getElementById(nodeID)) == null) {
		/*
		//clear and reset any possible edit and parameters
		if ((aSpan = getEditNode()) != null) {
			//clear this so no additional cancels come in
			clearInputEventHandlers(aSpan);
		}
		if (waitingToConfirmEdit()) {
			removeDialog1();
		}
		clearEditState();

		//remove all children of content Node
		do {
			contentNode.removeChild(contentNode.firstChild);
		} while (contentNode.firstChild != null);
		
		//start fresh with new P0 paragraph
		aSpan = document.createElement("p");
		aSpan.setAttribute("id","P0");
		contentNode.appendChild(aSpan);
		*/
	} else {
		//we do have this paragraph. Make sure it is last one
		/*
		//dump any edit going on in the paragraph or after (this shouldn't happen. if it does, it means some spans didn't get recalled)
		
		//get first span of paragraph
		tmpEl = aPara.firstChild;
		while (tmpEl != null) {
			if (tmpEl.nodeName.toUpperCase() == "SPAN") {
				break;
			}
			tmpEl = tmpEl.nextSibling;
		}
		if (tmpEl != null) {
			checkForEditOverlapWithCaptions(tmpEl);
		}
		*/

		//okay, now good to continue...
		//removes any paragraphs, esp corrector-added paragraphs after this para
		while ((tmpEl = aPara.nextSibling) != null) {
			contentNode.removeChild(tmpEl);
		}
		//now , delete this para
		contentNode.removeChild(aPara);
		
		//no need to fix attributes on previous sibling as this was a caption paragraph delete
		//if ((aPara = contentNode.lastChild) != null) {
		//	aPara.removeAttribute(SPECIALPARAFOLLOWS_ATTRIBUTE);
		//}

	}
}
				
//========================================================//
//========================================================//
function lockUpdate(start, end, initials, id) {
	//apply lock to span range
			
	var j;
	var aSpan;
	var tt;
	
	//now apply lock
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			//indicate it is locked
			setSpanLocked(aSpan, initials, id); 
			// Set highlight styles
			setLockStyle(aSpan);
			//set tooltip - only on spans with content
			if (aSpan.firstChild != null) {
				tt = aSpan.getAttribute(TOOLTIP_ATTRIBUTE);
				if (tt == null) {
					tt = " | ";
				} else {
					tt = " | " + tt;
				}
				aSpan.setAttribute(TOOLTIP_ATTRIBUTE, "LOCKED by: " + initials + tt);
			}
		}
	}
}

//========================================================//
//========================================================//
function editUpdate(start, end, initials, correction) {
//	//before applying new edit... check if stale range
//	if (checkForPossibleStaleEdit(start, end) == 1) {
//		//not stale.  Apply

		//strip out any leading or trailing whitespace and insert only one trailing space in span
		correction = correction.replace(/^\s+|\s+$/g,'');
		applyEditToRange(start, end, correction + " ", initials);
		
//	} else {
//		//was stale - do not apply.  Simply remove locks
//		//and set all background of the span objects back to their previous state.
//		unlockRange(start,end);
//	}
}


//========================================================//
//========================================================//
//dump an edit-in-progress if edit range overlaps with span with nodeID.  
//in fact, dump an edit-in-progress if span's nodeID is <= end range of the edit.
//(can't be editing spans after the current caption coming in, cuz there shouldn't be any)
function checkForEditOverlapWithCaptions(nodeID) {

	if (!noCurrentEdit()) {
		if (parseInt(nodeID,10) <= parseInt(editState.upperEditRange,10)) {
			cancelEdit();
		}
	}
/*
	var tmpStart = 0;
	var tmpEnd = 0;
	var inputElem;
	var aSpan;
	
	//if no edit box, move on
	if ((inputElem = getEditNode()) != null) {
		//we are editing and inputElem is the input node
		//Get range of the edit
		aSpan = inputElem.nextSibling;
		if (aSpan != null) {
			tmpStart = aSpan.id;
			tmpEnd = getEndRangeOfEdit(tmpStart);
			//Determine if we need to kill the edit before applying the correction that came in
			//if the caption is before or equal to the end of an edit group being edited, we need to dump the edit
			if (parseInt(nodeID,10) <= parseInt(tmpEnd,10)) {
				//debug('checkForEditOverlapWithCaptions::cancelEdit because nodeID=:'+nodeID+'  is less than tmpEnd '+tmpEnd);
				cancelEdit();
			}
		} else {
			//something wrong...no span after edit input element.
			cancelEdit();
		}
	}
*/
}

//========================================================//
//========================================================//
function checkAndRestoreCaptionRecallEnvironment(nodeID) {

	//
	// if overlap with edit range, kill edit
	// if range locked, unlock range
	// if overlap with an edit group, restore spans of edit group
		
	/*		
	var tmpStart = 0;
	var tmpEnd = 0;
	var inputElem;
	var aSpan;
	
	//assume nodeID is a valid span id (checked previously)
	
	//figure out how to do paragraph restore(FUTURE)

	startPar = para of start span
	endPar = para of end span
	if startPar != endPar
		do
			curPar = startPar.nextSibling
			if curPar is a user generated paragraph
				move all spans from curPar to StartPar
			else
				startPar = curPar
	while (curPar != endPar)

	//check if span under edit now
	//if no edit box, move on
	if ((inputElem = getEditNode()) != null) {
		//we are editing and inputElem is the input node
		//Get range of the edit
		aSpan = inputElem.nextSibling;
		if (aSpan != null) {
			tmpStart = aSpan.id;
			tmpEnd = getEndRangeOfEdit(tmpStart);
			//Determine if we need to kill the edit before applying the correction that came in
			//if the caption is before the end of an edit group, we need to dump the edit
			if (parseInt(nodeID,10) <= parseInt(tmpEnd,10)) {
				debug('checkForEditOverlapWithCaptions::cancelEdit because nodeID=:'+nodeID+'  is less than tmpEnd '+tmpEnd);
				cancelEdit();
			}
		} else {
			//something wrong...no span after edit input element.
			cancelEdit();
		}
	}
		*/
	var theRange;
	
	// if overlap with edit range, kill edit
	checkForEditOverlapWithCaptions(nodeID);

	//Now check if span is locked.  If locked, unlock range
	theRange = getLockedRange(nodeID);
	if (theRange.begin != -1) {
		unlockRange(theRange.begin, theRange.end);
	}
	
	//Now check if span has been edited
	theRange = getEditedRange(nodeID);
	if (theRange.begin != -1) {
		restoreRange(theRange.begin, theRange.end);
	}

	//return node...might be a different node than came in with since restore
	//might have created a new, clean node
	return document.getElementById(nodeID);
}


//========================================================//
//========================================================//
//could be renamed, checkForEditOverlapWithCorrection()
function checkForEditInterference(command, startRange, endRange, corInitials) {

	//check if a command came in that interferes with our edit.  This shouldn't happen if locks where checked before command sent on front end.  couple exceptions - locks and overrides.
	
	// need to check if we are editing and a correction comes in that affects the editing process
	if (!noCurrentEdit()) {
		//we are editing.  see if overlap
		//if there is no overlap, not necessary to interfere with the editing process
		if ( ((startRange >= editState.lowerEditRange) && (startRange <= editState.upperEditRange)) 
			|| ((endRange >= editState.lowerEditRange) && (endRange <= editState.upperEditRange)) 
			|| ((startRange < editState.lowerEditRange) && (endRange > editState.upperEditRange)) ) {
			
			//only allowable overlap situation is if it is our own lock request
			//now need to check if we are dealing with our own lock request, which is perfectly okay and the normal case
			if  (!( (command==LOCK_COMMAND) && (corInitials == userInitials) && (editState.lowerEditRange == startRange) && (editState.upperEditRange == endRange))) {
				// There is a stale edit situation.  We need to kill the edit and restore the dom before applying the correction
				cancelEdit();  //cancel but don't send unlock if edit already sent
			}
		}
	}

/*
	var tmpStart = 0;
	var tmpEnd = 0;
	var inputElem;
	var aSpan;

		
	// need to check if we are editing and a correction comes in that affects the editing process
	if ((inputElem = getEditNode()) != null) {
		//we are editing and inputElem is the input node
		//Get range of the edit
		aSpan = inputElem.nextSibling;
		if (aSpan != null) {
			tmpStart = aSpan.id;
			tmpEnd = getEndRangeOfEdit(tmpStart);
		
			//Determine if we need to kill the edit before applying the correction that came in
			
			//if there is no overlap, not necessary to interfere with the editing process
			if ( ((startRange >= tmpStart) && (startRange <= tmpEnd)) 
				|| ((endRange >= tmpStart) && (endRange <= tmpEnd)) 
				|| ((startRange < tmpStart) && (endRange > tmpEnd)) ) {
				
				//only allowable overlap situation is if it is our own lock request
				//now need to check if we are dealing with our own lock request, which is perfectly okay and the normal case
				if  (!( (command==LOCK_COMMAND) && (corInitials == userInitials) && (tmpStart == startRange) && (tmpEnd == endRange))) {
					// There is a stale edit situation.  We need to kill the edit and restore the dom before applying the correction
					cancelEdit();  //cancel but don't send unlock if edit already sent
				}
			}
		} else {
			//something wrong...no span after the edit box?
			cancelEdit();
		}
	}
*/
}

//========================================================//
//========================================================//
function replacer(match, p1, p2, offset, theStr) {
	if ((p2 == null) || (p2 == "")) {
		//not a "non-word" so must be a word
		return match;
	} else {
		var tmp = p2.charCodeAt(0);
		if (tmp <= 15) {
			return ("%0" + tmp.toString(16));
		} else {
			return ("%" + tmp.toString(16));
		}
	}
}

//========================================================//
function hexEncoder(str) {
	var tmpStr = "";
	if (str != "") {
		var re = /(\w)+|([\W])/g;
		tmpStr +=  str.replace( re, replacer);
	}
	return tmpStr;
}

/*
//========================================================//
//========================================================//
//get the last span of an edit group starting with start
function getEndRangeOfEdit(start) {

	var aSpan;
	var endSpanId = start;
	
	if ((aSpan = document.getElementById(start)) != null) {
		while (true) {
			if ((aSpan = aSpan.nextSibling) == null) {
				//at end.  This is okay
				break;
			} else if (spanIsMarkedEditing(aSpan)) {
				//found a span being edited.  Update, then continue
				endSpanId = aSpan.id;
			} else {
				//must not be hidden so at end of our range
				break;
			}
		}
	}
	return endSpanId;
}

*/

//========================================================//
//========================================================//
//check from start to end to see if any span is locked
function isAnyInRangeLocked(start,end) {

	var tmpElem;
	var i;
	
	/*
	var returnVal = true;
	
	for (i = start; i <= end; i++) {
		tmpElem = document.getElementById(i);
		//see if span exists and is locked
		if ((tmpElem == null) || (spanIsMarkedLocked(tmpElem))) {
			//either doesn't exist or is locked, so no need to continue 
			break;
		}
		if (i == end) {
			//made it all the way through so it is not locked
			returnVal = false;
		}
	}
	*/
	var returnVal = false;

	for (i = start; i <= end; i++) {
		if ((tmpElem = document.getElementById(i)) != null) {
			//see if span exists and is locked
			if (spanIsMarkedLocked(tmpElem)) {
				//found one. no need to continue 
				returnVal = true;
				break;
			}
		}
	}

	return returnVal;
}


//========================================================//
//========================================================//

function unlockRange(start,end) {

	var j;
	var aSpan;
	var tt;
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			setSpanUnlocked(aSpan);
			//find out what to set style back to
			if (!spanIsMarkedEdited(aSpan)) {
				//no previous edit
				setCaptionsStyle(aSpan);
			} else {
				//There was a previous edit so must set back to correct style
				setCorrectedStyle(aSpan);
			}
			//strip out lock portion of tooltip
			if (aSpan.firstChild != null) {
				tt = aSpan.getAttribute(TOOLTIP_ATTRIBUTE);
				if (tt != null) {
					tt = tt.replace(/^[\S\s]+\|\s/, "");
					if (tt == "") {
						aSpan.removeAttribute(TOOLTIP_ATTRIBUTE);
					} else {
						aSpan.setAttribute(TOOLTIP_ATTRIBUTE, tt);
					}
				}
			}
		}
	}
}

//========================================================//
//========================================================//
//get the range of the locked block that includes nodeID 
function getLockedRange(nodeID) {

	var lockAttr;
	var aSpan;
	var tmpSpan;
	var range = {"begin":-1,"end":-1};
	var done = false;
	
	if ((tmpSpan = document.getElementById(nodeID)) != null) {
		if (lockAttr = spanIsMarkedLocked(tmpSpan)) {
			range.begin = nodeID;
			range.end = nodeID;
			
			//go forward to get end  (most often we'll be at end already if a recall)
			aSpan = tmpSpan.nextSibling;
			while (aSpan != null) {
				if (spanIsMarkedLocked(aSpan) == lockAttr) {
					range.end = aSpan.getAttribute("id");
					aSpan = aSpan.nextSibling;
					if (aSpan == null) {
						//get next paragraph
						if ((aSpan = tmpSpan.parentNode.nextSibling) != null) {
							aSpan = aSpan.firstChild;
						}
					}
				} else {
					aSpan = null;
				}
			}
			//go backward to get beginning
			aSpan = tmpSpan.previousSibling;
			if (aSpan == null) {
				//get previous paragraph
				if ((aSpan = tmpSpan.parentNode.previousSibling) != null) {
					aSpan = aSpan.firstChild;
				}
			}
			while (aSpan != null) {
				if (spanIsMarkedLocked(aSpan) == lockAttr) {
					range.begin = aSpan.getAttribute("id");
					aSpan = aSpan.previousSibling;
					if (aSpan == null) {
						//get previous paragraph
						if ((aSpan = tmpSpan.parentNode.previousSibling) != null) {
							aSpan = aSpan.firstChild;
						}
					}
				} else {
					aSpan = null;
				}
			}
		}
	}
	
	return range;
}

//========================================================//
//========================================================//
//get the range of the edited block that includes nodeID
//so look for cccEdited and go forward and back until text
function getEditedRange(nodeID) {

	var editAttr;
	var aSpan;
	var tmpSpan;
	var range = {"begin":-1,"end":-1};
	
	
	if ((tmpSpan = document.getElementById(nodeID)) != null) {
		if (spanIsMarkedEdited(tmpSpan)) {
			range.begin = nodeID;
			range.end = nodeID;
			
			//go forward to get end (until get to first span that has text in it)
			aSpan = tmpSpan.nextSibling;
			while ((aSpan != null) && spanIsMarkedEdited(aSpan) && (aSpan.firstChild == null)) {
				range.end = aSpan.getAttribute("id");
				aSpan = aSpan.nextSibling;
			}
			
			//go backward to get to beginning (first non-empty child)
			while ((tmpSpan != null) && spanIsMarkedEdited(tmpSpan) && (tmpSpan.firstChild == null)) {
				range.begin = tmpSpan.getAttribute("id");
				tmpSpan = tmpSpan.previousSibling;
			}
			if (tmpSpan != null) {
				range.begin = tmpSpan.getAttribute("id");
			}
		}
	}
	return range;
}

//========================================================//
//========================================================//
function restoreRange(start, end) {

	//remember to handle locks
	var j;
	var text;
	var aSpan;
	var startPara, endPara, curPara;
	var tmpElem;
	var tmpSpan;
	
		/*
	startPar = para of start span
	endPar = para of end span
	if startPar != endPar
		do
			curPar = startPar.nextSibling
			if curPar is a user generated paragraph
				move all spans from curPar to StartPar
			else
				startPar = curPar
	while (curPar != endPar)
	*/

	/*
	//===needs updating if we want to restore across paragraphs.
	//restore paragraphs
	startPara = document.getElementById(start);
	endPara = document.getElementById(end);
	if ((startPara != null) && (endPara != null)) {
	
		startPara = startPara.parentNode;
		endPara = endPara.parentNode;
		
		if (startPara !== endPara) {
			do {
				curPara = startPara.nextSibling;
				if (curPara.getAttribute(CORRECTORPARA_ATTRIBUTE) != null) {
					//it is user generated; move all spans to start
					aSpan = curPara.firstChild;
					while (aSpan != null) {
						//get ptr to next sib before we lose it
						tmpSpan = aSpan.nextSibling;
						//move this sib
						startPara.appendChild(aSpan);
						//update to next sib
						aSpan = tmpSpan;
					}
					//check if we are at end and flag
					if (curPara === endPara) {
						endPara = startPara;
					}
					//now delete it
					curPara.parentNode.removeChild(curPara);
				} else {
					//move start forward to next captioner paragraph
					startPara = curPara;
				}
			} while (startPara != endPara);
		}
	}
	*/
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			//get text.  If none, nothing to restore
			if ((text = getOriginalSpanText(aSpan)) != null) {
				//create new span
				tmpElem = document.createElement("span");
				//put text in new span
				tmpElem.appendChild(document.createTextNode(text));
				//insert new span
				aSpan.parentNode.insertBefore(tmpElem, aSpan);
				//remove old span
				tmpElem.parentNode.removeChild(aSpan);
				//set id of new span
				tmpElem.setAttribute("id",j);
			}
		}
	}
}


//========================================================//
//========================================================//
function noCurrentEdit() {
	var result = true;
	
	if (getNode(editState.editBoxId) != null) {
		result = false;
	} else if (waitingToConfirmEdit()) {
		result = false;
	}
	return (result && !editState.editing);
}

//========================================================//
//========================================================//
function waitingToConfirmEdit() {
	return (document.getElementById("overlay1").style.visibility == "visible");
}

//========================================================//
//========================================================//
function getEditNode() {

	return getNode(editState.editBoxId);
}

//========================================================//
//========================================================//
function getNode(nodeID) {

	var returnVal = null;
	var tmpNode = document.getElementById(nodeID);
	if ((tmpNode != null) && (tmpNode.parentNode != null)) {
		returnVal = tmpNode; 
	}
	return returnVal;
}

/*


// -1 = error
// 0 = stale
// 1 = not stale
function checkForPossibleStaleEdit(start, end) {
	
	var startNode;
	var endNode;
	var returnVal = -1;
	//make sure spans are still there and not recalled
	startNode = document.getElementById(start);
	endNode = document.getElementById(end);
	if ((startNode != null)  && (endNode != null) && (startNode.parentNode != null) && (endNode.parentNode != null)) {
		//First, make sure the start and end are in the same paragraph since cross-paragraph corrections are not allowed and certainly indicate a stale operation.
		if (startNode.parentNode !== endNode.parentNode) {
			returnVal = 0;
		} else {
			//stale check - start doesn't have a null text element; 
			if (startNode.firstChild != null) {
				//okay continue to check end
				returnVal = checkForPossibleStaleEditEnd(end);
			} //else returnVal
		}
	}
	return returnVal;
}


function checkForPossibleStaleEditEnd(end) {
// -1 = error
// 0 = stale
// 1 = not stale

	var returnVal = -1;
	var aSpan;

	if ((aSpan = document.getElementById(end)) != null) {
		if ((aSpan = aSpan.nextSibling) == null) {
			//at end of paragraph.  Okay
			returnVal = 1;
		} else if (aSpan.tagName == "input") {
			//bumped into new edit group.  That is okay
			returnVal = 1;
		//} else if ((aSpan.firstChild == null) || (aSpan.firstChild.textContent == "")) {
		//	//stale because we would have included this span in the range if it was null or content was deleteAll'ed
		} else if (aSpan.firstChild == null) {
			//stale because we would have included this span in the range if it was null
			returnVal = 0;
		} else {
			//passed all the stale edit tests.  Good to go
			returnVal = 1;
		}
	} //else error- should not get a null
	return returnVal;
}


function checkForPossibleStaleEditWithEndNotEmpty(start, end) {
//looking for a stale edit, except the end node should not be empty cuz we are going to operate on it's text
//This is different than standard ranges where the end extends up to the last empty node.

// -1 = error
// 0 = stale
// 1 = not stale

	var startNode;
	var endNode;
	var returnVal = -1;
	//make sure spans are still there and not recalled
	startNode = document.getElementById(start);
	endNode = document.getElementById(end);
	if ((startNode != null)  && (endNode != null) && (startNode.parentNode != null) && (endNode.parentNode != null)) {
		//First, make sure the start and end are in the same paragraph since cross-paragraph corrections are not allowed and certainly indicate a stale operation.
		if (startNode.parentNode !== endNode.parentNode) {
			returnVal = 0;
		} else {
			//stale check - start doesn't have a null text element; 
			if ((startNode.firstChild != null) &&  checkThatSpanNotEmpty(endNode)) {
				returnVal = 1;
			} //else returnVal
		}
	}
	return returnVal;
}



function checkThatSpanNotEmpty(endNode) {
// -1 = error
// 0 = stale
// 1 = not stale

	var returnVal = -1;
	var aSpan;

	//stale check - start doesn't have a null text element or blank text element
	if ((aSpan = endNode.firstChild) == null) {
		// must have gotten swallowed up by a new edit group or a deleteAll and we are stale
		returnVal = 0;
	} else if ((aSpan.nodeType == NODETYPE_TEXT) && (aSpan.textContent != "")) {
		//there is text here to operate on
		returnVal = 1;
	}
	
	return returnVal;
}
*/

//========================================================//
//========================================================//
function applyEditToRange(start, end, text, initials) {

	var j;
	var tmpText;
	var aSpan;
	var startSpan = null;
	var accumulatedOriginalText = "";
	var toolTipEditor = "";
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			// save original captions and mark as edited (if not already saved)
			if (aSpan.firstChild != null) {
				if (!spanIsMarkedEdited(aSpan)) {
					setSpanEditedAndSaveOrigText(aSpan, aSpan.textContent);
				} //else already edited and saved

				//remove text nodes 
				//(FUTURE: allow multiple text nodes - e.g. for "NewSpeaker" associated with a span
				do {
					aSpan.removeChild(aSpan.firstChild);
				} while (aSpan.firstChild != null);
			}
			
			//if first span, put in new text
			if (j == start) {
				startSpan = aSpan;  //save for later use
				if (text == "") {
					//this was a DeleteAll so keep span but mark at special
					text = DELETED_PLACEHOLDER;
					setSpanTextDeletedFlag(aSpan,initials);
				} else {
					//clear a previous special attribute, since now it is normal
					unsetSpanTextDeletedFlag(aSpan);
				}
				aSpan.appendChild(document.createTextNode(text));
			} else {
				//clear a previous special attribute, since now it is normal
				unsetSpanTextDeletedFlag(aSpan);
				
			}
			//remove old attributes and set new ones
			
			//clear locked indicator
			setSpanUnlocked(aSpan);

			//remove editing indicator if set
			unsetSpanEditingFlag(aSpan);
			
			//remove quickclick attribute if set
			unsetSpanQCFlag(aSpan);
			
			//unhide if it was hidden
			unhideElement(aSpan);
			
			//set attribute to indicate who edited this span
			setSpanEditor(aSpan, initials);
			
			//set style to indicate it was corrected
			setCorrectedStyle(aSpan);
			
			//get tooltip info
			if ((tmpText = getOriginalSpanText(aSpan)) != null) {
				accumulatedOriginalText += tmpText;
			} //else error
			//only use editor(s) of first/master span
			if (j == start) {
				toolTipEditor = getSpanEditor(aSpan);
			}
		}
	}
	if (startSpan != null) {
		startSpan.setAttribute(TOOLTIP_ATTRIBUTE, accumulatedOriginalText + "[" + toolTipEditor + "]");
	}
}

//========================================================//
//========================================================//
function unhideElement(aSpan) {

	if (aSpan != null) {
		//aSpan.style.display='inline';
		aSpan.style.display="";
	}
}

//========================================================//
//========================================================//
function hideElement(aSpan) {

	if (aSpan != null) {
		//aSpan.style.display='inline';
		aSpan.style.display="none";
	}
}


//========================================================//
//========================================================//
//========================================================//
function setSpanEditor(aSpan, initials) {
	//mark the initials of the editor

	var tmpTtl;
	if (aSpan != null) {
		//set EDITOR_ATTRIBUTE attribute to indicate who edited this span
		tmpTtl = aSpan.getAttribute(EDITOR_ATTRIBUTE);
		if (tmpTtl == null) {
			//first time editing
			tmpTtl = initials;
		} else {
			////It's been edited before; append this editor
			//tmpTtl += "," + initials;
			//It's been edited before; add this editor if not already there
			tmpTtl += "," + initials;
		}
		aSpan.setAttribute(EDITOR_ATTRIBUTE, tmpTtl);
	}
}

//========================================================//
function getSpanEditor(aSpan) {

	return aSpan.getAttribute(EDITOR_ATTRIBUTE);
}

//========================================================//
/*********** Locked Indicator   *********************/
//========================================================//
function spanIsMarkedLocked(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(LOCKED_ATTRIBUTE) != null);
}

//========================================================//
function setSpanLocked(aSpan,initials,id) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(LOCKED_ATTRIBUTE, initials + id.toString());
	//aSpan.setAttribute(LOCKED_ATTRIBUTE, initials);
}

//========================================================//
function setSpanUnlocked(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(LOCKED_ATTRIBUTE);
}


//========================================================//
/*********** Edited Indicator   *********************/
//========================================================//
function spanIsMarkedEdited(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(EDITED_ATTRIBUTE) != null);
}

//========================================================//
function setSpanEditedAndSaveOrigText(aSpan,text) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(EDITED_ATTRIBUTE, text);
}

//========================================================//
function getOriginalSpanText(aSpan) {
	//assumes aSpan != null already been checked
	return aSpan.getAttribute(EDITED_ATTRIBUTE);
}

//========================================================//
function unsetSpanEdited(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(EDITED_ATTRIBUTE);
}

//========================================================//
/*********** Editing Indicator   *********************/
//========================================================//
function spanIsMarkedEditing(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(EDITING_ATTRIBUTE) != null);
}

//========================================================//
function setSpanEditingFlag(aSpan,initials) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(EDITING_ATTRIBUTE, initials);
	//aSpan.style.display = 'none';
}

//========================================================//
function unsetSpanEditingFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(EDITING_ATTRIBUTE);
}

//========================================================//
function setSpanEditingStyle(aSpan) {
	//assumes aSpan != null already been checked
	//aSpan.setAttribute(EDITING_ATTRIBUTE, initials);
	aSpan.style.display = 'none';
}

//========================================================//
function unsetSpanEditingStyle(aSpan) {
	//assumes aSpan != null already been checked
	//aSpan.setAttribute(EDITING_ATTRIBUTE, initials);
	aSpan.style.display = '';
}


//========================================================//
/************** Special DeleteAll Flag ***************/
//========================================================//
function spanIsMarkedTextDeleted(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(DELETED_ATTRIBUTE) != null);
}

//========================================================//
function setSpanTextDeletedFlag(aSpan,initials) {
	//assumes aSpan != null already been checked
	aSpan.setAttribute(DELETED_ATTRIBUTE, initials);
}

//========================================================//
function unsetSpanTextDeletedFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(DELETED_ATTRIBUTE);
}

//========================================================//
/************** Special QuickClick Flags ***************/
//========================================================//
function spanIsMarkedQC(aSpan) {
	//assumes aSpan != null already been checked
	return (aSpan.getAttribute(QUICKCLICK_ATTRIBUTE) != null);
}

function setSpanQuickClicked(aSpan, cmd, initials, text) {
	//assumes aSpan != null already been checked
	if (!spanIsMarkedEdited(aSpan)) {
		setSpanEditedAndSaveOrigText(aSpan, text);
	} //else already edited and saved
	
	aSpan.setAttribute(QUICKCLICK_ATTRIBUTE, cmd);
	setSpanEditor(aSpan, initials);
	setCorrectedStyle(aSpan);
}

//========================================================//
function unsetSpanQCFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(QUICKCLICK_ATTRIBUTE);
}

/*
function removeCorrectorParagraphFlag(aSpan) {
	//assumes aSpan != null already been checked
	aSpan.removeAttribute(LOCKED_ATTRIBUTE);
}
*/

//========================================================//
//========================================================//
function setCorrectedStyle(spanElement) {

	if (spanElement != null) {
		spanElement.className = "corrected";
		//spanElement.classList.add("corrected");
	}
/*
	//spanElement.style.color=CorrectColor;
	spanElement.style.background = document.getElementById('SetCCBG').value.toString();
	spanElement.style.color = document.getElementById('SetCC').value.toString();
	var isBold='normal';
	if (document.getElementById('CorrectedCaptionsBold').checked) isBold='Bold';
	spanElement.style.font = isBold+" "+document.getElementById('CCSetSize').value+"px "+document.getElementById('CorrectedFface').value;
	*/
}
//========================================================//
//========================================================//
function setCaptionsStyle(spanElement) {
//primarily used when escaping from an edit.

	if (spanElement != null) {
		//spanElement.className = "";
		//spanElement.classList.remove("locked");
		spanElement.removeAttribute("class");
	}
	/*
	spanElement.style.background='transparent';
	spanElement.style.color = document.getElementById('SetFC').value;
	var isBold='normal';
	if (document.getElementById('CaptionsBold').checked) isBold='Bold';
	spanElement.style.font = isBold+" "+document.getElementById('SetSize').value+"px "+document.getElementById('Fface').value;
	*/
}

//========================================================//
//========================================================//
function setLockStyle(spanElement) {

	if (spanElement != null) {
		spanElement.className = "locked";
		//spanElement.classList.add("locked");
	}
	/*
	//spanElement.style.background=lockedHighlight;
	spanElement.style.background = document.getElementById('SetHL').value.toString();
	spanElement.style.color = document.getElementById('SetHLFC').value.toString();
	var isBold='normal';
	if (document.getElementById('HLCaptionsBold').checked) isBold='Bold';
	spanElement.style.font = isBold+" "+document.getElementById('HLSetSize').value+"px "+document.getElementById('SelectedFface').value;
	*/
}



//========================================================//
//========================================================//
function setColor(optionSelected) {
	/*
	//	alert(document.getElementById('SetBG').value);
	//document.bgColor = '#FFFFFF';
	document.bgColor=''+ document.getElementById('SetBG').value +'';
	document.body.text=(""+ document.getElementById('SetFC').value +"");
	//document.getElementById('capcontent').style.fontSize = ""+ document.getElementById('SetSize').value +"px"+"";
	var isBold='normal';
	if (document.getElementById('CaptionsBold').checked) isBold='Bold';
	//document.getElementById("f1capcontent").style.font=isBold+" "+document.getElementById('SetSize').value+"px "+document.getElementById('Fface').value;
	//document.getElementById("capcontent").style.font="normal 28px";
	//document.getElementById("capcontent").style.fontFamily='Times New Roman';
	//alert('saved');
	lockedHighlight = (""+ document.getElementById('SetHL').value +"");
	CorrectColor = (""+ document.getElementById('SetCC').value +"");
	document.getElementById('Settings').style.display='none';
	*/
	var NUMITEMS = 3;
	var stylesUpdated = 0;
	var styleElem = document.getElementById('baseStyles').sheet;
	
	if (optionSelected == 0) {
		hideElement(document.getElementById('Settings'));
		//var styleElem = document.getElementById("baseStyles");
		
		for (var i = styleElem.cssRules.length; i--;) {
			if (styleElem.cssRules[i].selectorText == ".caption") {
				caption_bc = document.getElementById("SetBG").value;
				caption_c = document.getElementById("SetFC").value;
				styleElem.cssRules[i].style.backgroundColor = document.getElementById('SetBG').value.toString();
				styleElem.cssRules[i].style.color = document.getElementById('SetFC').value.toString();
				styleElem.cssRules[i].style.fontFamily = document.getElementById('Fface').value.toString();
				if (document.getElementById('CaptionsBold').checked)
					styleElem.cssRules[i].style.fontWeight = "bold";
				else
					styleElem.cssRules[i].style.fontWeight = "normal";
				styleElem.cssRules[i].style.fontSize = document.getElementById('SetSize').value.toString();
				stylesUpdated++;
				
			} else if (styleElem.cssRules[i].selectorText == ".locked") {
				locked_bc = document.getElementById("SetHL").value;
				locked_c = document.getElementById("SetHLFC").value;
				styleElem.cssRules[i].style.backgroundColor = document.getElementById('SetHL').value.toString();
				styleElem.cssRules[i].style.color = document.getElementById('SetHLFC').value.toString();
				styleElem.cssRules[i].style.fontFamily = document.getElementById('SelectedFface').value.toString();
				if (document.getElementById('HLCaptionsBold').checked)
					styleElem.cssRules[i].style.fontWeight = "bold";
				else
					styleElem.cssRules[i].style.fontWeight = "normal";
				///////
				//styleElem.cssRules[i].style.fontSize = document.getElementById('HLSetSize').value.toString();
				///////
				stylesUpdated++;
				
			} else if (styleElem.cssRules[i].selectorText == ".corrected") {
				corrected_bc = document.getElementById("SetCCBG").value;
				corrected_c = document.getElementById("SetCC").value;
				styleElem.cssRules[i].style.backgroundColor = document.getElementById('SetCCBG').value.toString();
				styleElem.cssRules[i].style.color = document.getElementById('SetCC').value.toString();
				styleElem.cssRules[i].style.fontFamily = document.getElementById('CorrectedFface').value.toString();
				if (document.getElementById('CorrectedCaptionsBold').checked)
					styleElem.cssRules[i].style.fontWeight = "bold";
				else
					styleElem.cssRules[i].style.fontWeight = "normal";
					
				if (document.getElementById('CorrectedCaptionsUnderline').checked)
					styleElem.cssRules[i].style.textDecoration = "underline";
				else
					styleElem.cssRules[i].style.textDecoration = "";

					
					
				////////
				//styleElem.cssRules[i].style.fontSize = document.getElementById('CCSetSize').value.toString();
				/////////
				stylesUpdated++;
			}
			if (stylesUpdated >= NUMITEMS) break;
		}
	}
}
//showColorGrid2('SetBG','SetBGbutton');


// The functions below are used to trigger AJAX to check for new captions or corrections every x seconds
/////////////////////////////////////////
//////////////////////////////////////////
function pollNow() {
	
	debug1("::PollNow:: begin");
	immediatePollRequested = true;
	clearTimeout(pollingTimerEvent);
	polling();
	debug1("::PollNow:: end");
	
}

//////////////////////////////////////////
//////////////////////////////////////////
function polling() {
	
	debug1("::polling:: begin");
	if (stopFlag == false) {
		if (!inPollRequest) {
			//xmlhttpPoll("capreceiver", "&v=" + globalState.documentVersion);
			xmlhttpPoll("capreceiver", DOCVERSION_PARAM + "=" + globalState.documentVersion);
		} else {
			debug1("::polling:: in poll request");
		}
		pollingTimerEvent = setTimeout(polling,POLL_TIMEOUT);
	}
	debug1("::polling:: end");
	
}

//////////////////////////////////////////
//////////////////////////////////////////
function startPolling() {
	stopFlag = false;
	polling();
}

//////////////////////////////////////////
//////////////////////////////////////////
function stopPolling() {
	stopFlag = true;
	debug("Request to stop Polling received via StopPolling())");
}



//////////////////////////////////////////
//////////////////////////////////////////
function scrollDown() {
	scrollingIsOn = true;
	scrollingIsPaused = false;
	prevScrollTop = 0;
}

//////////////////////////////////////////
//////////////////////////////////////////
function showCaptionsMessage() {
	var inputElem = document.getElementById("ShowScroll");
	if (inputElem != null) {
		//inputElem.style.zIndex="2";
		//document.f1.style.zIndex="1";
		inputElem.style.display="block";
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
function hideCaptionsMessage() {
	var inputElem = document.getElementById("ShowScroll");
	if (inputElem != null) {
		//inputElem.style.zIndex="0";
		//document.f1.style.zIndex="1";
		inputElem.style.display="none";
	}
	
	//document.f1.CapsBelow.style.zIndex="0";
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function ScrollingPage() {	
	if (scrollingTurnedOn == false) {
		hideCaptionsMessage();
		return;
	}
	
	/*
    var docEle = document.documentElement;
    var newScrollTop = Math.max(docEle.scrollTop, document.body.scrollTop);
    var scrollOverflow = docEle.scrollHeight - (newScrollTop + docEle.clientHeight);
    */
	var docEle = document.getElementById("capwindow");
	var newScrollTop = docEle.scrollTop;
	var scrollOverflow = docEle.scrollHeight - (newScrollTop + docEle.offsetHeight);
	
	/*
    if (newScrollTop < prevScrollTop && scrollOverflow > 5 && CaptionsHaveChanged == 0)
        scrollingIsOn = 0;
    if (scrollOverflow < 3)
        scrollingIsOn = 1;
    if (scrollingIsOn > 0)
	*/
	//---###//---###//---###//---###
    if (newScrollTop < prevScrollTop && scrollOverflow > 5 && CaptionsHaveChanged == 0) {
        scrollingIsOn = false;
	}
    if (scrollOverflow < 3) {
        scrollingIsOn = true;
	}
    if (scrollingIsOn == true && scrollingIsPaused == false && noCurrentEdit() == true)
	//---###//---###//---###//---###
	    
        {
		/*
        window.scrollBy(0, Math.max(1, scrollOverflow / 10));
        prevScrollTop = Math.max(docEle.scrollTop, document.body.scrollTop);
		*/
		docEle.scrollTop = newScrollTop + Math.max(1, (scrollOverflow + 20) / 10, scrollOverflow - 500);
		prevScrollTop = docEle.scrollTop;
        }
    
    //scrollingTimerEvent = setTimeout('ScrollingPage()',50);
    scrollingTimerEvent = setTimeout(ScrollingPage,50);
    CaptionsHaveChanged = 0;
	
	/*
	if (scrollingIsOn == 0) {
	*/
	//---###//---###//---###//---###
	if (scrollingIsOn == false || ((scrollingIsPaused == true) && (noCurrentEdit() == true) && (scrollOverflow > 5))) {
	//---###//---###//---###//---###
	
		showCaptionsMessage();
	} else {
		hideCaptionsMessage();
	}
}


/*
old code from when using comet method
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function loadIframe(srcPath) {
	//var i = document.getElementById("comet_iframe");
	var i = document.createElement("iframe");
	i.id = "comet_iframe";
	i.name = "comet_iframe";
	i.className = "iframeStyle";
	//i.scrolling = "auto";
	//i.frameborder = "0";
	document.getElementById("iframeDiv").appendChild(i);
	//document.body.appendChild(i);
	i.src = srcPath;
}
*/

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function saveSettings(selection) {
	setColor(selection);
	scrollingTurnedOn = document.getElementById('scrolling').checked;
	if (scrollingTurnedOn == true) {
		clearTimeout(scrollingTimerEvent);
		ScrollingPage();
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function initVars(selection) {

	initTempVars(selection);
	setColor(selection);
	scrollingTurnedOn = document.getElementById('scrolling').checked;

	ScrollingPage();

}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function initTempVars(selection) {

	//load current values and temp values used in settings divs
	if ((selection == 0) || (selection == 1)) {
		//standard captions

		document.getElementById("SetBGbutton").style.backgroundColor = captionOrig_bc;
		document.getElementById("SetBG").defaultValue = captionOrig_bc;
		document.getElementById("SetBG").value = captionOrig_bc;
		document.getElementById("SetFCbutton").style.backgroundColor = captionOrig_c;
		document.getElementById("SetFC").defaultValue = captionOrig_c;
		document.getElementById("SetFC").value = captionOrig_c;
		
		document.getElementById("Fface").value = captionOrig_ff;
		document.getElementById("SetSize").value = captionOrig_fs;
		document.getElementById("CaptionsBold").checked = fontWeightCheckbox;
	}
	if ((selection == 0) || (selection == 2)) {
		//locked/selected/highlighted

		document.getElementById("SetHLbutton").style.backgroundColor = lockedOrig_bc;
		document.getElementById("SetHL").defaultValue = lockedOrig_bc;
		document.getElementById("SetHL").value = lockedOrig_bc;
		document.getElementById("SetHLFCbutton").style.backgroundColor = lockedOrig_c;
		document.getElementById("SetHLFC").defaultValue = lockedOrig_c;
		document.getElementById("SetHLFC").value = lockedOrig_c;
		
		document.getElementById("SelectedFface").value = captionOrig_ff;
		//document.getElementById("HLSetSize").value = captionOrig_fs; 
		document.getElementById("HLCaptionsBold").checked = fontWeightCheckbox;
	}
	if ((selection == 0) || (selection ==3)) {
		//corrected captions

		document.getElementById("SetCCBGbutton").style.backgroundColor = correctedOrig_bc;
		document.getElementById("SetCCBG").defaultValue = correctedOrig_bc;
		document.getElementById("SetCCBG").value = correctedOrig_bc;
		document.getElementById("SetCCbutton").style.backgroundColor = correctedOrig_c;
		document.getElementById("SetCC").defaultValue = correctedOrig_c;
		document.getElementById("SetCC").value = correctedOrig_c;
		
		document.getElementById("CorrectedFface").value = captionOrig_ff;
		//document.getElementById("CCSetSize").value = captionOrig_fs; 
		document.getElementById("CorrectedCaptionsBold").checked = fontWeightCheckbox;
		document.getElementById("CorrectedCaptionsUnderline").checked = correctedCaptionsUnderlineCheckbox;
		
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function loadCurrentSettings(selection) {

	var NUMITEMS = 3;
	var stylesUpdated = 0;
	
	//var styleElem = document.styleSheets.baseStyles;
	var styleElem =  document.getElementById('baseStyles').sheet;;
	
	for (var i = styleElem.cssRules.length; i--;) {
		if ((selection & 1) && (styleElem.cssRules[i].selectorText == ".caption")) {
			//standard captions
			document.getElementById("SetBGbutton").style.backgroundColor = caption_bc;
			document.getElementById("SetBG").defaultValue = caption_bc;
			document.getElementById("SetBG").value = caption_bc;
			document.getElementById("SetFCbutton").style.backgroundColor = caption_c;
			document.getElementById("SetFC").defaultValue = caption_c;
			document.getElementById("SetFC").value = caption_c;

			document.getElementById("Fface").value = styleElem.cssRules[i].style.fontFamily;
			document.getElementById("SetSize").value = styleElem.cssRules[i].style.fontSize;
			if (styleElem.cssRules[i].style.fontWeight == "bold")
				document.getElementById("CaptionsBold").checked = true;
			else 
				document.getElementById("CaptionsBold").checked = false;
			stylesUpdated++;

		} else if ((selection & 2) && (styleElem.cssRules[i].selectorText == ".locked")) {
			//locked/selected/highlighted
			document.getElementById("SetHLbutton").style.backgroundColor = locked_bc;
			document.getElementById("SetHL").defaultValue = locked_bc;
			document.getElementById("SetHL").value = locked_bc;
			document.getElementById("SetHLFCbutton").style.backgroundColor = locked_c;
			document.getElementById("SetHLFC").defaultValue = locked_c;
			document.getElementById("SetHLFC").value = locked_c;
			
			document.getElementById("SelectedFface").value = styleElem.cssRules[i].style.fontFamily;
			//document.getElementById("HLSetSize").value = styleElem.cssRules[i].style.fontSize;
			if (styleElem.cssRules[i].style.fontWeight == "bold")
				document.getElementById("HLCaptionsBold").checked = true;
			else 
				document.getElementById("HLCaptionsBold").checked = false;
			stylesUpdated++;
			
		} else if ((selection & 4) && (styleElem.cssRules[i].selectorText == ".corrected")) {
			//corrected captions
			document.getElementById("SetCCBGbutton").style.backgroundColor = corrected_bc;
			document.getElementById("SetCCBG").defaultValue = corrected_bc;
			document.getElementById("SetCCBG").value = corrected_bc;
			document.getElementById("SetCCbutton").style.backgroundColor = corrected_c;
			document.getElementById("SetCC").defaultValue = corrected_c;
			document.getElementById("SetCC").value = corrected_c;
			
			document.getElementById("CorrectedFface").value = styleElem.cssRules[i].style.fontFamily;
			//document.getElementById("CCSetSize").value = styleElem.cssRules[i].style.fontSize;
			if (styleElem.cssRules[i].style.fontWeight == "bold")
				document.getElementById("CorrectedCaptionsBold").checked = true;
			else 
				document.getElementById("CorrectedCaptionsBold").checked = false;
			if (styleElem.cssRules[i].style.textDecoration == "underline")
				document.getElementById("CorrectedCaptionsUnderline").checked = true;
			else 
				document.getElementById("CorrectedCaptionsUnderline").checked = false;
				
			stylesUpdated++;
		}
		if (stylesUpdated >= NUMITEMS) break;
	}

}


