<!DOCTYPE html>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
-->
<!-- <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
-->
<?php

	$debInline = "";
	$PreviousCaptions = '';

function debugInline($text) {
	global $debInline;
	$debInline = $debInline.$text."<br />";
}
 
	$roomid = $_GET['roomid'];
	$initials = $_GET['initials'];
	$pwd = $_GET['pwd'];
	$debug = '0';
	$debug = $_GET['debug'];
	$IsMobile = 0;
	if ($_GET['mobile']){
		//header('Location: caption_ajax.php?roomid='.$roomid.'&initials='.$initials.'&pwd='.$pwd.'&debug='.$debug);
		$IsMobile = 1;
	}
	if ($pwd!="") {
		if ($initials=="") {
			echo "You must enter your initials!!";
			return;
		}
  
		if (strlen($initials)!= 2) {
			echo "You must enter 2 chars for initials!!!!";
			return;
		}
	}
	$myFile = $roomid."_password.txt";
	//remove the following if using DB
////////////////////////////////////
	// open pasword TXT of this session (depricated. Now using DB)
	if (file_exists("WEB-INF/caption_texts/".$myFile)) {
		$fh = fopen("WEB-INF/caption_texts/".$myFile, 'r');
		$AuthPWD = fread($fh, 50);
		fclose($fh);
		//echo "$AuthPWD:".md5($pwd)."<P>";
	}
	else {
		echo "Session does not exist";
		exit;
	}
//////////////////////////////////
	$CorrectorAuthenticated=0;
	if ($pwd =='password123456') $CorrectorAuthenticated=1;
	
	$PreviousCaptions = 1;
	
	/*
	// mysql code to check room passwrod
	include('config.php');
	$result = mysql_query("SELECT * FROM admin where session='" . $myFile . "'");
	$num_rows = mysql_num_rows($result);
	if ($num_rows>0){
		$row = mysql_fetch_array($result);
		$senhadocorretordb = $row['corrector_pwd'];
		if (($senhadocorretordb!=$pwd) && ($pwd!='')) {
			echo "Wrong password!";
			mysql_close($conexao); 
			exit;
		}
		else {
			$CorrectorAuthenticated=1;
			$PreviousCaptions = $row['PreviousCaptions'];
		}
	}
	else {
		echo "Session does not exist";
		mysql_close($conexao); 
		exit;
	}
	 mysql_close($conexao); 
	// mysql code to check room passwrod

	if ($roomid=="") {
		$roomid="rs9b804f98592a";
		echo("ROOM ID NOT FOUND using default rs9b804f98592a; Remember to use ?roomid=MYROOMID<br>");
	}
*/
	
///////////////******************************************************//////////
	/*

	
	  // Obtain current captions to place into the "POrevious Captions"div layer
	$horario = date("m_d_Y");
	$nome = $horario."_".$roomid.".txt";
	$myFile = "WEB-INF/caption_texts/".$nome;
	if (file_exists($myFile)) {
		$fh = fopen($myFile, 'r');
		while(!feof($fh)) {
			$theData.=fgets($fh);
		}
		fclose($fh);
	}


	////NOTE: what to do with leading /trailing spaces, also mulitple spaces inbetween words???? 
	// split the original captions into an array using "space" as a delimiter
	$theData = str_replace("$27$", "'", $theData);
	$theData = str_replace("#", "'", $theData);

	// remove multiple whitespace - added by joe
	//$theData = preg_replace('/\s+/', ' ', $theData);

	$PrevCaps = split(" ",$theData);  //comment by joe - this is deprecated.  Use the following
	//$PrevCaps = preg_split("[ ]",$theData);
	//$PrevCaps = explode(" ",$theData);
	if ($debug == '1') {
		$i = 0;
		foreach ($PrevCaps as $tmp) {
			debugInline("PrevCaps[$i]:[".$tmp."]");
			$i++;
		}
//		print_r ($PrevCaps);
//		echo ("PrevCaps=:".$PrevCaps);
	}


	// Calculate number of words to set initial counter (contador) to correct number
	// Note: initially this calculation was done in Comet and sent via comet to javascript, but we found
	// that the number was often incorrect, so it was changed to be calculated here in PHP
	$contador = preg_match_all('/[ ]/', $theData, $matches);

	// contador = number of delimiters, not words

	//$contador = count($PrevCaps);
	if ($debug == '1') {
		debugInline("contador:".$contador);
	}
	$theData2=$theData;
	// set theData to nothing to rebuild in the parsing process
	$theData="";

	// Get the corrections file data
	$nome = $horario."_".$roomid."_fix.txt";
	$myFile = "WEB-INF/caption_texts/".$nome;
	if (file_exists($myFile)) {
		$fh = fopen($myFile, 'r');
		while(!feof($fh)) {
			$theFix.=fgets($fh);
		}
		fclose($fh);
	}
	
	$theFix = str_replace("$27$", "'", $theFix);
	$theFix = str_replace("#", "'", $theFix);

	//Parse the corrections file onto the previous captions text
	// First split the fix file with the delimeter ^ to get the lines of corrections sent
	// Then for each line split the line with ~ to get the start span, end span, text correction, id, and coprrector initials
	// if the text is not an UnDoChange, then change that text in the original array of words along with span style of red
	// Note: the file always begins with "START: ", so we need to remove that from the very first line of correction
	$FixCaps = split("\^ ",$theFix); //deprecated
	//$FixCaps = preg_split("\^ ",$theFix);
	
	//SHOULD initialize $i
	//$i=0;

	if ($debug == '1') {
		debugInline("FixCaps_");
		debugInline(print_r ($FixCaps, true));
	}

	foreach ($FixCaps as &$fixes) {
				//for ($i=0;$i<$FixCaps;$i++){
//		if ($i==0) {
//			//remove Start:
//		}
		$FixCapsData = split("~",$fixes);
		if ($debug == '1') {
			debugInline("FixCapsData_");
			debugInline(print_r ($FixCapsData, true));
		}

		if (($FixCapsData[2] != 'UnDoChange') && ($FixCapsData[2] != '')) {
			// create the fix for the first element
			//remember, prevcaps index is one less than fixcapdata span numbers
			$PrevCaps[$FixCapsData[0]-1] = "<span style=\"color:red;\">".$FixCapsData[2]."</span> ";
			//$start = $FixCapsData[0] + 1;
			//for ($j=$start;$j<$FixCapsData[1];$j++) {
			//	$PrevCaps[$j] = "X".$fixes;
			//}
			// now get next element index
			$start = $FixCapsData[0] + 1;
			//clear out each element up through last element
			for ($j=$start;$j<=$FixCapsData[1];$j++) {
				//remember, prevcaps index is one less than fixcapdata span numbers
				$PrevCaps[$j-1] = '';
			}
			if ($debug == '1') {
				debugInline("Made a fix");
			}
		}
		$i++;
	}
	//debug
	if ($debug == '1') {
		$i = 0;
		debugInline('<textarea rows="5">');
		foreach ($PrevCaps as $tmp) {
			debugInline("PrevCaps1[$i]:[".$tmp."]\r\n");
			$i++;
		}
		debugInline('</textarea>');
	}
	//
	$i=0;
	foreach ($PrevCaps as &$prevs) {
		if ($prevs != "") {
			$theData.="<span id=\"".$i."\">".$prevs."</span> ";
		}
		$i++;
	}
	//debug
	if ($debug == '1') {
		//debugInline('<textarea rows="5">'.print_r($theData, true).'</textarea>');
		debugInline('<textarea rows="5">'.str_replace("<span","\r\n<span",print_r($theData, true)).'</textarea>');

	}
	
	
	*/
	//////////************************************///////////////
	
	

?>


<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">
<head>
<META http-equiv="Content-Type" content="text/html; charset=utf-8" />
<META http-equiv="Content-Script-Type" content="text/javascript">

<title>Comet demo0.6.8</title>
<!--
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Comet demo0.6.8</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
-->
	<style type="text/css" media="screen"  id="inputStyle">
		.inputE {
			width:350px;
		}
		
	</style>
	
	<style type="text/css" media="screen" id="baseStyles">
		/*remember to keep in sync with variables below in script section*/
		
		.caption {
			background-color: #FFFFFF;
			color: #000000;
			font-family: Arial;
			font-weight: normal;
			font-size: 18px;
		}
		
		
		.locked {
			background-color: #FFFF00;
			color: #000000;
			font-family: Arial;
			font-weight: normal;
			/*font-size: 18px;*/
		} 
		
		.corrected {
			background-color: #FFFFFF;
			color: #FF0000;
			font-family: Arial;
			font-weight: normal;
			text-decoration: underline;
			/*font-size: 18px;*/
		}
		
		iframeStyle {
			width: 1px;
			height: 1px;
			position: absolute;
			top: -1000px;
		}
		
		.iframeDiv {
			width: 1px;
			height: 1px;
			position: absolute;
			top: -1000px;
			display: none;
		}
		
		.divtest {
			position: absolute;
			top: -1200px;
			visibility: hidden;
			height: auto;
			width: auto;
		}
		
		.font1 {font-family:Arial}
		.font2 {font-family:Monospace}
		.font3 {font-family:Lucida Sans Unicode}
		.font4 {font-family:Times}

		.size1 {font-size:18px}
		.size2 {font-size:24px}
		.size3 {font-size:32px}
		.size4 {font-size:42px}
		.size5 {font-size:54px}

		/* hide "x" to clear inside <input elements in IE 10 */
		::-ms-clear {
		display: none;
		}
		
		
	</style>

<script>

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

var fontWeightCheckbox = false;   //corresponds to "normal", er...not bold

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



</script>

<script>
	var debugIt = false;
	if ("<?php echo($debug); ?>" === "1") debugIt = true;
	
	var LOCK_COMMAND = "Lock";
	var EDIT_COMMAND = "Edit";
	var CANCELLOCK_COMMAND = "CancelLock";
	var DELETEALL_COMMAND = "DeleteAll";
	var COMMA_COMMAND = "Comma";
	var PERIOD_COMMAND = "Period";
	var QUESTION_COMMAND = "Question";
	var CAPITALIZE_COMMAND = "Capitalize";
	var PARAGRAPH_COMMAND = "Paragraph";
	var OVERRIDE_COMMAND = "OverrideLock";
	var heartbeatTimer;
	var lastCheckIn = 0;
	var lastCleanup = 0;

	var lockRequestPending = false;

	var KeyZ = 0; // ascii 90
	var KeyX = 0; // ascii 88
	var KeyC = 0; // ascii 67

	var KeyComma = 0; // ascii 188
	var KeyPeriod = 0; // ascii 190
	var KeyQuestion = 0; // ascii 191
	var KeyN = 0; // ascii 78
	var KeyO = 0; // ascii 79
	var KeyB = 0; // ascii 66

	var CurrentPosition = 0;
	var CorrectionPosition = 0;
	var myroomid = "<?php echo($roomid); ?>";
	var authenticatedCorrector = "<?php echo($CorrectorAuthenticated); ?>";

<?php

	session_start();
	//if(strcmp(md5($pwd),$AuthPWD)==0){


/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

	if ($CorrectorAuthenticated==1) {
		$_SESSION["logged"] = 255; 
		$_SESSION["enterJob"] = 0;
		$_SESSION["exitJob"] = 0;
		//if(crypt($pwd,$AuthPWD)) == $AuthPWD){ // If password matches, then print the editing scripting
		//if ($pwd=='wow'){
	}
?>

	var userInitials = '<?=$initials?>'; //
	var Dlayer=0;
	var Ulayer=0;
	
	var lowerEditRange = -1;
	var upperEditRange = -1;
	
	var editing = false;
	var minNum = 1;
	var maxNum = 255;
	//var OriginalText = '';
	var SendChange = false; // This is used to prevent Chrome from UnDoChange when Enter key is pressed and triggering OnBlur
	var originalSelectedText = ''; //this is used for text comparison to see if change has actually been made
	var readingPreviousCaptions = false;

	var globalSpanIDCounter = 0;
	var globalParagraphIDCounter = 0;
	



/*******************************************************/
/*******************************************************/
function debug(text) {
	if (debugIt) {
		if (window.console) {
			window.console.log(text);
		}
	}
}


/*******************************************************/
/*******************************************************/
function SetKeyDown(event) {
//http://unixpapa.com/js/testkey.html

	if (authenticatedCorrector == 0) return;
	
	var keyCode = ('which' in event) ? event.which : event.keyCode;
	debug('SetKeyDown::event.keyCode:'+keyCode);	//alert(keyCode);
	if (keyCode==90) {
		KeyZ = 1;
		//alert(KeyZ);
	}
	else if (keyCode==88) {
		KeyX = 1;
	}
	else if (keyCode==188) {
		KeyComma = 1;
	}
	else if (keyCode==190) {
		KeyPeriod = 1;
	}
	else if (keyCode==67) {
		KeyC = 1;
	}
	else if (keyCode==66) {
		KeyB = 1;
	}
	else if (keyCode==191) {
		KeyQuestion = 1;
	}
	else if (keyCode==78) {
		KeyN = 1;
	}
	else if (keyCode==79) {
		KeyO = 1;
	}
	
	else if (keyCode == 27) {
		if (event.preventDefault) event.preventDefault();
		if (event.returnValue) event.returnValue = false;
		return false;
	}

	
//	// "i" to show the comet iframe
//	if (keyCode==73) {
//		//if (document.getElementById('comet_iframe').style.top<1;)
//		//{
//		document.getElementById('comet_iframe').style.top='0';
//		//else {
//		//	document.getElementById('comet_iframe').style.top='-200';
//		//}
//	}
	debug('SetKeyDown:: DONE');	//alert(keyCode);
}

/*******************************************************/
/*******************************************************/
function SetKeyUp(event) {

	if (authenticatedCorrector == 0) return;
	
//http://unixpapa.com/js/testkey.html
	debug('SetKeyUp:: START');	//alert(keyCode);
	var keyCode = ('which' in event) ? event.which : event.keyCode;
	debug('SetKeyUp::event.keyCode:'+keyCode);
	KeyZ = 0;
	KeyX = 0;
	KeyComma = 0;
	KeyPeriod = 0;
	KeyN = 0;
	KeyQuestion = 0;
	KeyC = 0;
	KeyB = 0;
	KeyO = 0;
	debug('SetKeyUp:: DONE');	//alert(keyCode);
}

/*******************************************************/
/*******************************************************/
function SetDown(event) {

	if (authenticatedCorrector == 0) return;
	
	debug('SetDown:: START');
	debug('SetDown:: mousedown?: event.target.id: '+event.target.id);

	//may need to check if you clicked on a span that is empty but not hidden...not sure if that is possible, but we don't want that to happen.
	//As of now, we are not deleting blank spans but we can't hide them either since we only hide items being edited while the input box if visible.
	
//	if (editing == false) {
	if (getEditNode() == null) {
		//sometimes getting target.id of outer form (f1capcontent) instead of what we really want....check into this.
		//////////verify whether we want "" or null
		if  ((event.target.id != "") && (!isNaN(event.target.id))) {
			//event.target.id is id of element that triggered the event
			Dlayer=parseInt(event.target.id);
			//alert(Dlayer);
			debug('SetDown:: Dlayer:'+Dlayer);
		} else {
			debug ('SetDown:: error on event.target.id: ' + event.target.id);
		}
	} else {
		debug('SetDown:: Edit box found.  Ignoring mouse-down');
	}
	debug('SetDown:: END');
}

/*******************************************************/
/*******************************************************/
function SetUp(event) {

	if (authenticatedCorrector == 0) return;
	
	debug('SetUp:: START');
	debug('SetUp:: mouseup?: event.target.id:'+event.target.id);
	debug('SetUp:: editing=:'+editing+' :Dlayer=:'+Dlayer);
	debug('SetUp:: isNaN(event.target.id):'+isNaN(event.target.id));
	
	//may need to check if you clicked on a span that is empty but not hidden...not sure if that is possible, but we don't want that to happen.
	//As of now, we are not deleting blank spans but we can't hide them either since we only hide items being edited while the input box if visible.
	
	//if (editing == false && Dlayer >= 0) {		///---### modified by DK
	if ((getEditNode() == null) && (Dlayer >= 0)) {
	
		//sometimes getting target.id of outer form (f1capcontent) instead of what we really want....check into this.
		//////////verify whether we want "" or null
		if  ((event.target.id != "") && (!isNaN(event.target.id))) {
			Ulayer=parseInt(event.target.id);

			debug('SetUp:: Ulayer:'+Ulayer);
			
			//only do special functions if clicked on a single word - not a range of words.  Ignore if a range of words.
			if ((KeyC==1) || (KeyComma==1)) {
				if (Dlayer == Ulayer) {
					// This is a comma addition. 
					doQuickClickBasic(Dlayer, COMMA_COMMAND);
				}
			} else if ((KeyX==1) || (KeyPeriod==1)) {
				if (Dlayer == Ulayer) {
					// This is a period addition. 
					doQuickClickExtended(Dlayer, PERIOD_COMMAND);
				}
			} else if ((KeyZ==1) || (KeyQuestion==1)) {
				if (Dlayer == Ulayer) {
					// This is a question mark addition. 
					doQuickClickExtended(Dlayer, QUESTION_COMMAND);
				}
			} else if (KeyB==1) {
				if (Dlayer == Ulayer) {
					// This is a capitalization. 
					doQuickClickBasic(Dlayer, CAPITALIZE_COMMAND);
				}
			} else if (KeyN==1) {
				if (Dlayer == Ulayer) {
					// This is a new paragraph. 
					doQuickClickBasic(Dlayer, PARAGRAPH_COMMAND);
				}
			} else if (KeyO==1) {
				if (Dlayer == Ulayer) {
					// This is an OVERRIDE. 
					sendCommand(Dlayer, getExtendedRangeForThwartingStaleEdit(Dlayer), OVERRIDE_COMMAND, "");
				}
			} else {
				//orient mouse down/up
				if (Ulayer < Dlayer) {
					var temp = Ulayer;
					Ulayer = Dlayer;
					Dlayer = temp;
				}

				//check if both ends on same paragraph
				if (document.getElementById(Dlayer).parentNode === document.getElementById(Ulayer).parentNode) {
				
					//enlarge range to include blank spans - for stale data problem
					//var upperRange = getExpandedUpperRange(Ulayer);
					debug('SetUp:: call startEditing() on range of words');

					startEditing(Dlayer, getExtendedRangeForThwartingStaleEdit(Ulayer));
					debug('SetUp:: back from startEditing()');
					
				} else {
					debug("SetUp:: can't edit across paragraphs");
				}
			}
		} else {
			debug ('SetUp:: ignore error on event.target.id: ' + event.target.id);
		}
	} else {
		debug('SetDown:: Edit box found.  Ignoring mouse-down');
	}

	Dlayer = -1;
	debug('SetUp:: END');
}

/*******************************************************/
/*******************************************************/
function doQuickClickBasic(start,command) {
	debug('doQuickClickBasic:: START');
	debug('doQuickClickBasic::start=:'+start+'  :command=:'+command);

	var end = getExtendedRangeForThwartingStaleEdit(start);

	//make sure none of the range is locked
	if (isAnyInRangeLocked(start,end) == false) {
		sendCommand(start, end, command, "");
	}

	debug('doQuickClickBasic:: END');
}

/*******************************************************/
/*******************************************************/
function doQuickClickExtended(start,command) {
	debug('doQuickClickExtended:: START');
	debug('doQuickClickExtended::start=:'+start+'  :command=:'+command);

	var capFlag = "";
	var end = getExtendedRangeForThwartingStaleEdit(start);

	//We will check if a capitalization span exists and pass that range along with the flag so comet backend knows what to do.
	//If no capitalization span exists (e.g. word clicked is at end of a paragraph), the range only includes the range of the edit group
	
	var aSpan = document.getElementById(end);
	if ((aSpan != null) && ((aSpan = aSpan.nextSibling) != null) && (aSpan.firstChild != null) && (aSpan.firstChild.textContent != "")) {
		end = aSpan.id;
		capFlag = "cap";
	}

	//make sure none of the range is locked
	if (isAnyInRangeLocked(start,end) == false) {
		sendCommand(start, end, command, hexEncoder(capFlag));
	}

	debug('doQuickClickExtended:: END');
}


/*******************************************************/
/*******************************************************/
function startEditing(start, end) {
	debug('startEditing:: START');

	if (authenticatedCorrector == 0) return;
	
	lowerEditRange = start;
	upperEditRange = end;
	
	//make sure none of the range is locked
	if (isAnyInRangeLocked(lowerEditRange,upperEditRange) == false) {
	
		debug('startEditing::lowerEditRange=:'+lowerEditRange+'  :upperEditRange=:'+upperEditRange);
		var buildTextLayer = "";
		var tmpElem;
		var i;
		var j;
		for (i = lowerEditRange; i <= upperEditRange; i++) {
			tmpElem = document.getElementById(i);
			//see if span exists, is not in a current edit by us, and is not locked
			if (tmpElem.style.display != 'none') {
				try {
					buildTextLayer = buildTextLayer + tmpElem.textContent;
				} catch (e) {
					alert ('Trying to get .textContent: '+ e.message);
				}
				//indicate it is in our edit group
				document.getElementById(i).style.display='none';
			} else {
				//it is already being edited by us - not sure how we got to this point but it is not right
				debug("startEditing::i=:" + i + " An error or check triggered ....");
				debug("startEditing::i=:" + i + " document.getElementById(i).style.display=: " + tmpElem.style.display);
				
				//undo all the hiding .. lowerEditRange though i-1  (i.e. j<i)
				for (j = lowerEditRange; j < i; j++) {
					unhideElement(document.getElementById(j));
				}
				return false;
			}
		}
		debug('startEditing::buildTextLayer=:'+buildTextLayer);
		
		// Set the variable to what is in the textbox. 
		// This is to do a comparison when Enter is pressed to see if the text has actually changed
		originalSelectedText = buildTextLayer;

		editing = true;
		lockRequestPending = true;
		
		var inputElem;
		//reuse old node if still laying around unlinked, else make new one
		if ((inputElem = document.f1.t1) == null) {
			inputElem = document.createElement("input");
			inputElem.setAttribute("name","t1"); 
			inputElem.type = "text";
		}
		inputElem.className = "caption inputE";
		//inputElem.setAttribute("size","1"); 
		//inputElem.setAttribute("width","1px"); 
		inputElem.setAttribute("onkeydown","processInputChar(this,event)");
		inputElem.setAttribute("onkeyup","boxExpand(this)");
		inputElem.setAttribute("onBlur","cancelEditBlur()"); 
		inputElem.setAttribute("onFocus","processInputChar(this,event)"); 
		inputElem.setAttribute("onChange","processInputChar(this,event)"); 

		inputElem.defaultValue = buildTextLayer;
		inputElem.value = buildTextLayer;

		document.getElementById(lowerEditRange).parentNode.insertBefore(inputElem, document.getElementById(lowerEditRange));

		debug('startEditing::document.f1.t1.value: '+document.f1.t1.value);

		document.f1.t1.focus();
		document.f1.t1.select();
		boxExpand(document.f1.t1);

		sendCommand(lowerEditRange, upperEditRange, LOCK_COMMAND, "");
		debug('startEditing:: END');
	}
}


</script>


<script>

/*******************************************************/
/*******************************************************/
function cancelEditBlur() {
	debug('cancelEditBlur::Start lowerEditRange=:'+lowerEditRange+'  :Ulayer=:'+Ulayer);
	cancelEdit();
	debug('cancelEditBlur::Done lowerEditRange=:'+lowerEditRange+'  :Ulayer=:'+Ulayer);
}

/*******************************************************/
/*******************************************************/
function cancelEdit() {


	debug('cancelEdit::Start lowerEditRange=:'+lowerEditRange+'  :Ulayer=:'+Ulayer+'  :editing=:'+editing);

	//careful.  removing the tag may trigger the onBlur handler..
	
	var tmpNode;
	var tmpStart, tmpEnd;
	if ((tmpNode = getEditNode()) != null) {
		//clear this so no additional cancels come in
		clearInputAttributes(tmpNode); 

		//get 1st span in edit range
		var aSpan = tmpNode.nextSibling;
		tmpStart = aSpan.id;
		tmpEnd = tmpStart;
		
		//un-hide the spans
		while (aSpan != null) {
			if (aSpan.style.display == 'none') {
				unhideElement(aSpan);
				tmpEnd = aSpan.id;
				aSpan = aSpan.nextSibling;
			} else {
				//we reached end of editing range
				break;
			}
		}
		
		//remove the input element
		tmpNode.parentNode.removeChild(tmpNode);

		if (editing) {
		
			//clear the "we are editing" flag
			editing = false;
			if (!lockRequestPending) {
				//send the undo
				sendCommand(tmpStart, tmpEnd, CANCELLOCK_COMMAND, "");
			}
		} else {
			//no longer editing - which means we either cancelled previously or sent the 
			//edit already and comet is cancelling the edit.  Can't put the toothpaste 
			//back in the tube - no need to cancel lock.
			debug("canceEdit:: Already sent edit so no unlock command to send.  Just restore dom");
		}
	} else {
		debug("cancelEdit:: NO EDIT in progress.");
	}
	debug("cancelEdit::done");
}


///////////////////////////
//document.onkeydown=SetKeyDown(event);

//////////////////////////////////////
var junktest = 0;
/*******************************************************/
/*******************************************************/
//http://unixpapa.com/js/testkey.html
//document.onkeyup=boxExpand;  //find a better place for this.  Also note difference between keypress and key down/up and pick appropriate one

function processInputChar(me,event) {

	debug('boxExpand:: START with me:'+me);
	
	var returnVal = true;
	var tmpNode;
	
	var Key = '';
	
	/*
	//var intKey = window.event ? event.keyCode : e.which;
	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
		Key = me.which;
		if (Key != undefined) {
			debug('FF got a key [' + Key + ']');
		}
		debug('FF enter');
		debug('Key=: ' + Key);
	}
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
		Key = me.which;
		//debug('IE enter');
	}
	if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
		Key = me.event;
		//debug('Opera enter');
	}
	if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
		//alert('chrome');
		Key = event.keyCode;
		//debug('Chrome enter');
	}
	if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
		Key = event.keyCode;
		//debug('Safari enter');
	}
*/
	//watch out of difference between onkeypress and onkeydown as well as keycode vs charcode for non-char keys
	if (me.event) // IE8 and earlier
		{
		Key = event;
		}
	else if (event.which) // IE9/Firefox/Chrome/Opera/Safari
		{
		Key = event.which;
		}
	else if (event.keyCode) // IE9/Firefox/Chrome/Opera/Safari
		{
		Key = event.keyCode;
		}
//for keypress, event.which exists, but is 0 for escape in some browsers, so need to get keyCode.

	// check for escape out of editing
	if (Key == 27) {
		debug('boxExpand::Key = 27 ESC ::START');
		//me.onblur = null;  //trap for Chrome and/or others triggering the OnBlur with .innerHTML is written below
		
		cancelEdit();
		//need to block the default behavior of the ESC key which kills the loading of pages - i.e. kills comet
		if (event.preventDefault) event.preventDefault();
		if (event.returnValue) event.returnValue = false;
		debug('boxExpand::Key = 27 ESC ::DONE');
		returnVal = false;
		
	} else if (Key == 13) {
		debug("boxExpand::Key = 13 ENTER key ::START");
		//make sure re-entry into this portion is blocked after 1st pass until comet server gets around to applying the edit and thereby removing the event handler calls into boxexpand
		//
		if ((tmpNode = getEditNode()) != null) {
			//we still have the edit box
			
			//wait for lock request response before allowing edit
			if (!lockRequestPending) {
			
				//strip off leading and trialing spaces
				var newText = tmpNode.value;
				newText = newText.replace(/^\s+|\s+$/g,'');

				// If text was unchanged then treat just like a cancel edit
				if (newText == originalSelectedText.replace(/^\s+|\s+$/g,'')) {
					//both are the same
					cancelEdit();
					
				} else {
					//send edit, but first....

					//clear further events
					clearInputAttributes(tmpNode);
					editing = false;
					
					// If the text was completely deleted, then send the DELETEALL_COMMAND code
					if (newText == "") {
						sendCommand(lowerEditRange, upperEditRange, DELETEALL_COMMAND, "");
					} else {
						newText = hexEncoder(newText + " ");
						sendCommand(lowerEditRange, upperEditRange, EDIT_COMMAND, newText);
					}
					
					//block default behavior in browser
					if (event.preventDefault) event.preventDefault();
					if (event.returnValue) event.returnValue = false;

					debug("boxExpand::Key = 13 ENTER key ::DONE");
				}
				//should do something to show busy until response from comet server
			} else {
				debug("boxExpand::Key = 13 Still waiting for lockRequst...");
			}
		} else {
			debug("boxExpand::Key = 13 Edit box no longer exists");
		}
		debug("boxExpand::Key = 13 ENTER key ::END");
		
	} else {
		boxExpand(me);
	}
	
	/*else {
		debug("boxExpand::Key = nothing trapped ::START");
		boxValue = me.value.length;
		boxSize = me.size;

		if (boxValue > maxNum) {
		} else if (boxValue > minNum) {
			me.size = boxValue
		} else if (boxValue < minNum) {
			me.size = minNum
		}
		debug('boxExpand::Key = nothing trapped ::END');
	}*/
	
	debug('boxExpand::: done');
	return returnVal;
	
}

function boxExpand(me) {

	debug("boxExpand::Key = nothing trapped ::START");
	var elem = document.getElementById("sizetext");
	var text = me.value;
	//text = text.replace(/\s/g,"&nbsp;") + "W";
	text = text.replace(/\s/g," .") + "W";
	elem.textContent = text;
	//convert whitespace to &nbsp;
	var size = (elem.offsetWidth + 10) + "px";
	var styleElem = document.getElementById("inputStyle").sheet;
	for (var i = 0; i < styleElem.cssRules.length; i++) {
		if (styleElem.cssRules[i].selectorText == ".inputE") {
			styleElem.cssRules[i].style.width = size;
		}
	}
	//document.f1.t1.size = size;
	/*
	boxValue = me.value.length;
	boxSize = me.size;

	if (boxValue > maxNum) {
	} else if (boxValue > minNum) {
		me.size = boxValue
	} else if (boxValue < minNum) {
		me.size = minNum
	}
	debug('boxExpand::Key = nothing trapped ::END');
	*/
}

/*******************************************************/
/*******************************************************/
function clearInputAttributes(tmpNode) {

	debug('clearInputAttributes::: start');

	tmpNode.removeAttribute("onkeydown");
	tmpNode.removeAttribute("onkeyUp"); 
	tmpNode.removeAttribute("onBlur"); 
	tmpNode.removeAttribute("onFocus"); 
	tmpNode.removeAttribute("onChange"); 

	debug('clearInputAttributes::: done');
}

/*******************************************************/
/*******************************************************/
function sendCommand(lower, upper, command, data) {

	var x1 = "start=" + lower + "&end=" + upper + "&command=" + command + "&data=" + data;
	debug('sendCommand:: calling xmlhttpPort with params = '+x1);
	
	xmlhttpPost("fix.php",x1);

	debug('sendCommand::Done');
}

///////////////////////////////////////////
///////////////////////////////////////////

/*******************************************************/
/*******************************************************/
function xmlhttpPost(strURL,parameterStr) {
	//alert('ajax:' + parameterStr);
	debug('xmlhttpPost:: Entered with strURL = :'+strURL+'   parameterStr=:' + parameterStr);
	debug('xmlhttpPost:: Entered');

	var MAXIMUM_WAITING_TIME = 15000; //milliseconds
	var request = false;
	var xmlHttpReq = null;
	//var self = this;

	// Mozilla/Safari
	if (window.XMLHttpRequest) {
		try {
			xmlHttpReq = new window.XMLHttpRequest();
		} catch (e) {
			request = false;
		}
	}
	// IE
	else if (window.ActiveXObject) {
		try {
			xmlHttpReq = new ActiveXObject("MSXML2.XMLHTTP.3.0");
		}
		catch (e) {
			try {
				xmlHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {
					request = false;
				}
			}
		}
	}
	if (!xmlHttpReq) {
		alert('Cannot create XLMHTTP instance');
		debug('xmlhttpPost:: Cannot create XLMHTTP instance');
		return request;
	}

	if (!xmlHttpReq.value)  {
		xmlHttpReq.value = parameterStr;
		debug('xmlhttpPost:: xmlHttpReq assigned value='+xmlHttpReq.value);
	} else {
		debug('xmlhttpPost:: xmlHttpReq already have value='+xmlHttpReq.value);
	}

	xmlHttpReq.open('POST', strURL, true);	//don't wait
	//xmlHttpReq.open('POST', strURL, false);  //wait

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
	xmlHttpReq.onreadystatechange = function ()
		{
		//////////////
			//var returnStr = "";
			debug("sssssssssssssssssssssssssssssssssssssssssssss<br /> <br />");
			debug('onreadystatechange Function START');
			debug('xmlhttpPost::xmlHttpReq callback function running');
			debug('xmlhttpPost:: xmlHttpReq.value='+this.value);
			try {
				if (this.readyState === 1) {
					debug('xmlhttpPost::xmlHttpReq.readyState=:1');
				} 
				else if (this.readyState === 2) {
					debug('xmlhttpPost::xmlHttpReq.readyState=:2');
				}
				else if (this.readyState === 3) {
					debug('xmlhttpPost::xmlHttpReq.readyState=:3');
					debug('xmlhttpPost::xmlHttpReq.responseText3=:'+this.responseText);
				}
				else if (this.readyState === 4) {
					debug('xmlhttpPost::xmlHttpReq.readyState=:4');
					//clearTimeout(requestTimer); //do not abort

					if (this.status == 200) {
						
						debug('xmlhttpPost::xmlHttpReq.status=:'+this.status);
						debug('xmlhttpPost::xmlHttpReq.responseText=:'+this.responseText);
						var returnStr = this.responseText;
						
						//if this was a response to the lock request and was accepted, and we are still editing, we are done here.
						//But if we are no longer editing, we must have cancelled the edit (ESC) - so we now have to send the undo command.  (undo-sending was delayed pending the response)
						//Don't forget to add that code. and test.  Hmmmmmm......what if we made an edit and hit <enter>ADDRESSED by not allowing a send until lock request response received
						
						//if it was a lock request and it was denied, and we are still editing, we cancel the edit.  No undo need be sent.
						//If we have already cancelled the edit, we do nothing.  No undo was sent
						//Don't forget to add that code. and test
						
						
						if (returnStr.indexOf("~OK;") != -1) {
							//command accepted.  check special case handling i.e. for Lock
							str = returnStr.substring(returnStr.indexOf("~OK;")+4, returnStr.length);
							// see if it was in response to a lock request
							var tmpStrArray = str.split('~');
							if (tmpStrArray[2] == LOCK_COMMAND) {
								debug('Got OK response for a lock');
								//if still editing, we are done.
								if (!editing) {
									//need to send the undo command
									debug('Got OK for lock but not editing. Need to send Unlock.');
									//var tmpStrArray = str.split('~');
									sendCommand(parseInt(tmpStrArray[0]), parseInt(tmpStrArray[1]), CANCELLOCK_COMMAND, "");
								} else {
									debug('Got OK for lock and still editing.  We are good to go.');
								}
								lockRequestPending = false;
							} else {
								// was a response to something else
								debug('Got OK response for : ' + str);
							}
						} else if (returnStr.indexOf("~!;1") != -1) {
							// request denied.  Find out what the request was
							debug('Last request denied.  What was it? : ' + returnStr);
							str = returnStr.substring(returnStr.indexOf("~!;1")+4, returnStr.length);
							// if lock, remove the editbox
							var tmpStrArray = str.split('~');
							if (tmpStrArray[2] == LOCK_COMMAND) {
							//if (str.charAt(0)=='L') {
								debug('Lock denied.');
								if (editing) {
									debug('Lock denied and still editing.  No use keeping that up.  Cancel editing');
									//cancel the edit but don't send undo
									//get lower and upper range of request

									//Dlayer = parseInt(tmpStrArray[0]);
									//Ulayer = parseInt(tmpStrArray[1]);
									//need to deal with onBlur thing  REMEMBER TO CODE!!!!  (dealt with by "try/catch" in cancelEdit.  may want to do a cleaner way)
									cancelEdit();
									lockRequestPending = false;  //don't need to send out an undo if previous request denied so put this after cancelEdit.
								} else {
									//not editing so that stuff taken care of.  No undo needed or previously sent
									debug('Lock denied but no longer editing.  Good to carry on.');
									lockRequestPending = false;
								}
							} else {
								debug('Other request denied: ' + str);
								
								//figure out what to do on request denied for other types of requests
								
							}
						} else {
							//don't know what code came back???
							debug('Error of some type:  xmlhttpPost::xmlHttpReq.status=:200, return str =:'+returnStr);
						}
					} else {
						debug('Error of some type - NOT status=200:  xmlhttpPost::xmlHttpReq.status=:'+this.status);
						debug('xmlhttpPost::xmlHttpReq.statusText=:'+this.statusText);
					}
				} else {
					debug('not sure what up - ready not 1,2,3 or 4: xmlhttpPost::xmlHttpReq.readyState=:'+this.readyState);
				}
			} //try
			catch (e) {
				debug('Caught Exception on readyState in xmlhttpPost');
			}
			debug('onreadystatechange Function END');
			debug("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<br /> <br />");
		}
		/////////////
		
	var myroomid = "<?php echo($roomid); ?>";
	debug('xmlhttpPost::xmlHttpReq.send=:'+ 'correction=' + parameterStr + '&roomid=' + myroomid + '&c=' + userInitials);
	xmlHttpReq.send(parameterStr + '&roomid=' + myroomid + '&initials=' + userInitials);
	// self.xmlHttpReq.send('id=' + parameterStr);
	debug ('xmlhttpPost:: END');
}

/****************************************************/
/*****************************************************/
function xmlhttpPostCaptions(strURL,parameterStr) {
	var xmlHttpReq = false;
	var self = this;

	// Mozilla/Safari
	if (window.XMLHttpRequest) {
		self.xmlHttpReq = new XMLHttpRequest();
	}
	// IE
	else if (window.ActiveXObject) {
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.open('POST', strURL, true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	self.xmlHttpReq.onreadystatechange = function () 
		{
		///////////////
		   // alert('oi');
			if (self.xmlHttpReq.readyState == 4) {
				//alert(self.xmlHttpReq.responseText);
				var str = self.xmlHttpReq.responseText;
				if (str == ";;" || str == "") {
					//alert("php nao recebeu dados");
					return;
				} 
				if (str.length > 4) {
					// we assume this is a response from AJAX captions

					// parse the string and perform necessary functions
					// we need to split to get ne CurrentPosition, Value, Text

					// First we split our result by the carat character (^)
					// we use the first result of this split to display new captions
					
					var caps = new Array();
					caps=str.split("^");
					
					var ss = new Array();
					ss=caps[0].split("~");
					if (ss[2]) {
						comet_update(ss[1],ss[2]);
						CurrentPosition = ss[0];
					}
					// now we grab and additional "corrections" that were sent and send them
					// to comet_update as well
					CorrectionPosition = CorrectionPosition + str.split('^').slice(1).join('^').length;

					for (st=1;st<caps.length;st++) {
						// we send the corrections as a value of -1 and the comet_update routine handles the rest
						comet_update('-1',caps[st]);
					}
					// now add on the number of characters to correctly parse the correction file for new corrections
				}
				
				if (str=="OK;") {
					// later we are changing this to confirmation 0 or 1 depending on lock file
					//alert('confirmado que o php recebeu');
				}
				else {
				}   
			}
		}
		///////////////

	self.xmlHttpReq.send(parameterStr);
}


// end of editing scripting password authentication 
////////////////////////
////////////////////////
////////////////////////

/*******************************************************/
/*******************************************************/
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

/*******************************************************/
/*******************************************************/
function processPreviousCaptions(fId, tmpCount, tmpStr) {
	var tmpIDNum = globalSpanIDCounter;
	readingPreviousCaptions = true;
	comet_update(fId, tmpCount, tmpStr);
	if (globalSpanIDCounter != tmpIDNum + parseInt(tmpCount)) {
		//there is an error here.
		alert("Server [" + tmpCount + "] and Client [" + (globalSpanIDCounter - tmpIDNum) + "] disagree on word counts!");
	}
	readingPreviousCaptions = false;
}

/*******************************************************/
/*******************************************************/
function  startHeartbeat() {
	heartbeatTimer = setTimeout(function() {
		alert("Comet connection lost. Last check-in at: [" + lastCheckIn + "].  Refresh browser to reconnect");
		//tell it was aborted
		}, 1000 * 30);
}

/*******************************************************/
/*******************************************************/
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

/*******************************************************/
/*******************************************************/
function comet_update(fId, codeVal,dataStr) {
	debug("comet_updatea::fId: ["+fId + "]");
	debug("comet_updatea::codeVal: ["+codeVal + "]");
	debug("comet_updateb::dataStr before decode : ["+dataStr + "]");
	
	CaptionsHaveChanged = 1;  //signal to scrolling routine of potential content change

	//signals initial word count in dataStr
	if (codeVal==-2) {
		
		debug("codeVal = -2");
		
		return;
	}
	//signals something from the fix /correction file
	else if (codeVal == -1) {
		// 25~25~~steve3~rs^ = deixa amarelo
		// 25~25~correction~steve3~rs = vem com correction
		// 25~25~UnDoChange~steve3~rs = faz algo
		debug("codeVal = -1");
		var correctionElementsArray;
		var startRange;
		var endRange;
		var command;
		var correction;
		var roomID;
		var correctorInitials;
		
		//strip off any legacy START: text from corrections file
		dataStr = dataStr.replace(/^START:/g,'');
		
		var correctionStrArray = dataStr.split("^");
		
		for (i = 0; i < correctionStrArray.length; i++) {
			//strip off leading and trailing spaces
			correctionStrArray[i] = correctionStrArray[i].replace(/^\s+|\s+$/g,'');
			if (correctionStrArray[i] == "") {
				//move on to next
				continue;
			}
			
			correctionElementsArray = correctionStrArray[i].split("~");
			
			//make sure all the pieces are there
			if (correctionElementsArray.length != 6) {
				alert("Received an invalid correction request from server.");
				return;
			}
			
			//let's break it down to make it easier
			startRange = parseInt(correctionElementsArray[0]);  //start
			endRange = parseInt(correctionElementsArray[1]);     //end
			command = correctionElementsArray[2]; 
			correction = correctionElementsArray[3];//corrected word or command (if any)
			correction = decodeURIComponent(correction);
			debug("comet_update1::command [" + command + "] dataStr after decode : "+correction);
			roomID = correctionElementsArray[4];    //roomid
			correctorInitials = correctionElementsArray[5];//initials

			//if (correction != "") correction = correction.replace(/\#/g,"'");
			
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////

			var tmpStart, tmpEnd;
			var inputElem;
			var aSpan;
			var tmpTxt;
					
			// need to check if we are editing and a correction comes in that affects the editing process
			if ((inputElem = getEditNode()) != null) {
				//we are editing and inputElem is the input node
				//Get range of the edit
				tmpStart = inputElem.nextSibling.id;
				tmpEnd = getEndRangeOfEdit(tmpStart);
				
				//Determine if we need to kill the edit before applying the correction that came in
				
				//if there is no overlap, not necessary to interfere with the editing process
				if ( ((startRange >= tmpStart) && (startRange <= tmpEnd)) 
					|| ((endRange >= tmpStart) && (endRange <= tmpEnd)) 
					|| ((startRange < tmpStart) && (endRange > tmpEnd)) ) {
					
					//now need to check if we are dealing with our own lock request, which is perfectly okay and the normal case
					if  (!((correctorInitials == userInitials) && (tmpStart == startRange) && (tmpEnd == endRange) && (command==LOCK_COMMAND))) {
					
						// There is a stale edit situation.  We need to kill the edit and restore the dom before applying the correction
						
						cancelEdit();  //cancel but don't send unlock if edit already sent
						/*
						
						aSpan = inputElem.nextSibling;
						while (aSpan != null) {
							if (aSpan.style.display == 'none') {
								aSpan.style.display = "inline";
								aSpan = aSpan.nextSibling;
							} else {
								//we reached end of editing range
								break;
							}
						}
						//remove input element
						inputElem.parentNode.removeChild(inputElem);
						*/
						
					}
				}
			}
			// now apply the correction
			
				/////////////////////////////////////////////
			if (command==LOCK_COMMAND) {
				// it is a lock request - no stale edit check here, just apply
				var j;
				//now apply lock
				for (j = startRange; j <= endRange; j++) {
					if ((aSpan = document.getElementById(j)) != null) {
						//indicate it is locked
						aSpan.setAttribute("name",correctorInitials); 
						// Set highlight styles
						SetLockStyle(aSpan);
					}
				}

			///////////////////////////////////
			} else if (command == EDIT_COMMAND) {
				//It is a correction
				//before applying new edit... check if stale range
				if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					//not stale.  Apply
					applyEditToRange(startRange, endRange, correction, correctorInitials);
				} else {
					//was stale - do not apply.  Simply remove locks
					//and set all background of the span objects back to their previous state.
					unlockRange(startRange,endRange);
				}
				
			///////////////////////////////////////////////////////////////////////////////
			} else if ((command==CANCELLOCK_COMMAND) || (command==OVERRIDE_COMMAND)) {
				unlockRange(startRange,endRange);
		
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==DELETEALL_COMMAND) {
				
				//before applying new edit... check if stale range
				if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					//not stale.  Apply
					applyEditToRange(startRange, endRange, "", correctorInitials);
				} else {
					//was stale - do not apply.  Simply remove locks
					//and set all background of the span objects back to their previous state.
					unlockRange(startRange,endRange);
				}

				
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==COMMA_COMMAND) {
				//check if edit is stale before applying
				//Find out if we are applying a capitalization or not.  This will affect stale check
				if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					// add comma unless a comma already exists
					if (((aSpan = document.getElementById(startRange)) != null) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						//if (tmpTxt.length == 0) {
						//	aSpan.textContent = ", ";
						//} else
						if (tmpTxt.length == 1) {
							//this shouldn't happen but deal with for robustness
							//if char is a space or a comma, make it right
							if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == ',')) {
								aSpan.textContent = ", ";
							} else {
								aSpan.textContent = tmpTxt + ", ";
							}
							//set title attribute to indicate who edited this span
							setSpanEditor(aSpan, correctorInitials);
							
						} else if (tmpTxt.charAt(tmpTxt.length-2) != ',') {
							aSpan.textContent = tmpTxt.replace(/\s$/,", ");
							//set title attribute to indicate who edited this span
							setSpanEditor(aSpan, correctorInitials);
						}
					}
				}
			////////////////////////////////////////////////////////////////////////////////
			} else if ((command==PERIOD_COMMAND) || (command==QUESTION_COMMAND)) {
				//check if edit is stale before applying
				//Find out if we are applying a capitalization or not.  This will affect stale check
				if (((correction == "cap") && (checkForPossibleStaleEditEndInclusive(startRange,endRange) == 1)) 
						|| ((correction == "") && (checkForPossibleStaleEdit(startRange, endRange) == 1)) ) {
			
					//edit is not stale so good to apply
					//if Add_Period, and text ends in question mark, change it to period and capitalize next word
					//if Add_Question and ends in a period, add question mark and capitalize next word
					if (((aSpan = document.getElementById(startRange)) != null) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						if (command==PERIOD_COMMAND) {
							//if (tmpTxt.length == 0) {
							//	aSpan.textContent = ". ";
							//} else 
							if (tmpTxt.length == 1) {
								//this shouldn't happen but deal with for robustness
								//if char is a space or a period, make it right.  Replace a question mark with a period
								if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.') || (tmpTxt.charAt(0) == '?')) {
									aSpan.textContent = ". ";
								} else {
									aSpan.textContent = tmpTxt + ". ";
								}
								//set title attribute to indicate who edited this span
								setSpanEditor(aSpan, correctorInitials);
							} else {
								var localTmpTxt = tmpTxt;
								//replace ? with the period
								tmpTxt = tmpTxt.replace(/\?\s$/,". ");
								if (tmpTxt.charAt(tmpTxt.length-2) != '.') {
									//append the period 
									tmpTxt = tmpTxt.replace(/\s$/,". ");
								}
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = tmpTxt;
									//set title attribute to indicate who edited this span
									setSpanEditor(aSpan, correctorInitials);
								}
							}
						} else { //if (command==QUESTION_COMMAND) {
							//if (tmpTxt.length == 0) {
							//	aSpan.textContent = "? ";
							//} else 
							if (tmpTxt.length == 1) {
								//this shouldn't happen but deal with for robustness
								//if char is a space or a question mark, make it right.  Replace a period with a question mark 
								if ((tmpTxt.charAt(0) == ' ') || (tmpTxt.charAt(0) == '.') || (tmpTxt.charAt(0) == '?')) {
									aSpan.textContent = "? ";
								} else {
									aSpan.textContent = tmpTxt + "? ";
								}
							} else {
								var localTmpTxt = tmpTxt;
								//replace period with a question mark
								tmpTxt = tmpTxt.replace(/\.\s$/,"? ");
								if (tmpTxt.charAt(tmpTxt.length-2) != '?') {
									//append the question mark 
									tmpTxt = tmpTxt.replace(/\s$/,"? ");
								}
								if (localTmpTxt != tmpTxt) {
									//content changed
									aSpan.textContent = tmpTxt;
									//set title attribute to indicate who edited this span
									setSpanEditor(aSpan, correctorInitials);
								}
							}
						}
						
						//now see if we need to capitalize a word
						if (correction == "cap") {
							if (((aSpan = document.getElementById(endRange)) != null) && (aSpan.firstChild != null) ) {
								tmpTxt = aSpan.textContent;
								if (tmpTxt != null) {
									var localTmpTxt = tmpTxt;
									tmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
									if (localTmpTxt != tmpTxt) {
										//content changed
										aSpan.textContent = tmpTxt;
										//set title attribute to indicate who edited this span
										setSpanEditor(aSpan, correctorInitials);
									}
								}
							}
						}
					}
				}
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==CAPITALIZE_COMMAND) {
				if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null) && (aSpan.firstChild != null) ) {
						tmpTxt = aSpan.textContent;
						if (tmpTxt != null) {
							var localTmpTxt = tmpTxt;
							tmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = tmpTxt;
								//set title attribute to indicate who edited this span
								setSpanEditor(aSpan, correctorInitials);
							}
						}
					}
				}
			////////////////////////////////////////////////////////////////////////////////
			} else if (command==PARAGRAPH_COMMAND) {
				if (checkForPossibleStaleEdit(startRange, endRange) == 1) {
					if (((aSpan = document.getElementById(startRange)) != null) ) {
						
						//create the new paragraph
						var tempPara = document.createElement("p");
						//get current paragraph - we will insert the new para after this current para (but more complex than that - see below)
						var curPara = aSpan.parentNode;
						//use the id of the current para to construct the id for the new para
						tempPara.setAttribute("id",curPara.getAttribute("id") + "a"); 
						//insert new paragraph after curParagraph (i.e. before the curPara's next sibling)  if null, puts at end
						curPara.parentNode.insertBefore(tempPara, curPara.nextSibling);
						//now detach the span(s) from old para and attach to new para
						//point to first node that needs to move

						//capitalize it while we have it...
						tmpTxt = aSpan.textContent;
						if (tmpTxt != null) {
							var localTmpTxt = tmpTxt;
							//tmpTxt = tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
							tmpTxt = ">>>" + tmpTxt.charAt(0).toUpperCase() + tmpTxt.slice(1);
							if (localTmpTxt != tmpTxt) {
								//content changed
								aSpan.textContent = tmpTxt;
								//set title attribute to indicate who edited this span
								setSpanEditor(aSpan, correctorInitials);
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
			} else {
				alert("Received an invalid correction request from server: " + command);
			}

		}
		debug("done with -l correction processing");
		return; 
	} //end of if = -1
	else {
	 	//if you get here, new captions coming in 

		//assume multiple spaces have been removed
		debug('comet_updateXX1::');
		dataStr = decodeURIComponent(dataStr);
		debug('comet_update1::dataStr after decode : '+dataStr);
		//remove the last delim if it is at end of string - to deal with how .split works
		//dataStr.replace("%0A%20$",'');

		//split paragraphs on newline characters (line feed)
		//get array of paragraph marks (match global) or return an empty array
		//get length or array for count of number of paragraph marks
		var paraCount = (dataStr.match(/\n/g)||[]).length;
		debug ("paragraph counts = " + paraCount);
		var docFragment = null;
		var paraFragment = document.createDocumentFragment();


		//now split, remembering that if no newline, it will still split once 
		//i.e. the whole string (even if blank), and if there are newlines, 
		//will still split for the last block of text -whether or not there is a trailing newline
		var paraArray = dataStr.split("\n");
		//process tokens within each paragraph block
		var numParaBlocks = paraArray.length;
		
		//see if a paragraph where the span will be inserted already exists.  If not, create it.  
		//(We could put a <p> in the page to start, but this will take care of it too)
		//if (document.getElementById("p" + globalParagraphIDCounter.toString()) == null) {
		if ((document.f1.lastChild == null) || (document.f1.lastChild.nodeName.toLowerCase() != "p")){
			debug("comet_updateXX6:: putting in new paragraph: document.f1.lastChild ");
			docFragment = document.createDocumentFragment();
			var tempPara = document.createElement("p");
			tempPara.setAttribute("id","p" + globalParagraphIDCounter.toString()); 
			globalParagraphIDCounter++;
			docFragment.appendChild(tempPara);
			//document.f1.appendChild(createParagraphElement());
		}
		//process tokens within each paragraph block
		for (iPara=0; iPara < numParaBlocks; iPara++) {
			//debug("comet_updateXX2:: paraArray[iPara]=[" + paraArray[iPara] + "]  iPara=[" + iPara + "]  paraArray.length=["+ paraArray.length + "]");
			//get array of words
			//strip off any leading or trailing delimiters
			var curParaBlock = paraArray[iPara];
			curParaBlock = curParaBlock.replace(/^\s+|\s+$/g,'');
			//if nothing left in this paragraph, skip the token processing
			if (curParaBlock != "") {
				//Okay, there is at least one token here, so now split the tokens in this paragraph.
				var mySplitResult = curParaBlock.split(" ");
				var mySplitLen = mySplitResult.length;
				for (var i=0; i < mySplitLen; i++) {
					//debug("comet_updateXX3:: mySplitResult[i]=[" + mySplitResult[i] + "]  i=[" + i + "]  globalSpanIDCounter=["+ globalSpanIDCounter + "]");
					var tempElem = document.createElement("span");
					tempElem.setAttribute("id",globalSpanIDCounter.toString()); 
					globalSpanIDCounter++;
					var tempNode = document.createTextNode(mySplitResult[i] + " ");
					tempElem.appendChild(tempNode);
					paraFragment.appendChild(tempElem);
				}
				if (docFragment == null) {
					document.f1.lastChild.appendChild(paraFragment);
				} else {
					docFragment.lastChild.appendChild(paraFragment);
				}
			}
			//now see if we need to put in a new paragraph (remember, some blocks won't have any newline so won't need to start a new paragraph)
			if (paraCount > 0) {
				debug ("Putting in paragraph break.");
				//now put in split
				if (docFragment == null) {
					docFragment = document.createDocumentFragment();
				}
				var tempPara = document.createElement("p");
				tempPara.setAttribute("id","p" + globalParagraphIDCounter.toString()); 
				globalParagraphIDCounter++;
				docFragment.appendChild(tempPara);
				//document.f1.appendChild(createParagraphElement());
				paraCount--;
			}
		}
		if (docFragment != null) {
			document.f1.appendChild(docFragment);;
		}

		debug("done with new captions processing");
	}
	debug('comet_update::DONE');
}

/*
/*****************************************************/
/*****************************************************/
/*function replacer(match, p1, p2, offset, theStr) {
	if (p1 != null) return match;
	else return ("%" + p2.charCodeAt(0).toString(16));
}
*/

/*****************************************************/
/*****************************************************/
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

/*****************************************************/
function hexEncoder(str) {
	var tmpStr = "";
	if (str != "") {
		var re = /(\w)+|([\W])/g;
		tmpStr +=  str.replace( re, replacer);
	}
	return tmpStr;
}

/*****************************************************/
/*****************************************************/
function getEndRangeOfEdit(start) {

	var aSpan;
	var endSpanId = start;
	
	if ((aSpan = document.getElementById(start)) != null) {
		while (true) {
			if ((aSpan = aSpan.nextSibling) == null) {
				//at end of paragraph.  Okay
				break;
			} else if (aSpan.style.display == 'none') {
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


/*****************************************************/
/*****************************************************/
function getExtendedRangeForThwartingStaleEdit(id) {
	
	var returnVal = id;
	var aSpan;

	//extend range by including subsequent spans which have null text elements
	//***added: which have null text elements OR blank non-null text elements
	if ((aSpan = document.getElementById(id)) != null) {
		while (true) {
			if ((aSpan = aSpan.nextSibling) == null) {
				//at end of paragraph.  Okay
				break;
			} else if (aSpan.firstChild != null) {
				//found an existing text node - check if empty or not
				if (aSpan.firstChild.textContent == "") {
					//an empty text node so keep going
					//update id value with that of current span being checked and keep going
					returnVal = aSpan.id;
				} else {
					// text is not blank so done
					break;
				}
			} else {
				//no text node so keep going
				//update id value with that of current span being checked
				returnVal = aSpan.id;
			}
		}
	}
	
	return returnVal;
}

/*****************************************************/
/*****************************************************/

function isAnyInRangeLocked(start,end) {

	var tmpElem;
	var i;
	var returnVal = true;
	for (i = start; i <= end; i++) {
		tmpElem = document.getElementById(i);
		//see if span exists and is locked
		if ((tmpElem == null) || (tmpElem.getAttribute("name")  != null)) {
			//either doesn't exist or is locked, so no need to continue 
			break;
		}
		if (i == end) {
			//made it all the way through so it is not locked
			returnVal = false;
		}
	}
	return returnVal;
}


/*****************************************************/
/*****************************************************/

function unlockRange(start,end) {

	var j;
	var aSpan;
	var tmpTtl;
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			aSpan.removeAttribute("name"); 
			//find out what to set style back to
			//tmpTtl = aSpan.getAttribute("title");
			//if (tmpTtl == null) {
			if (!spanIsMarkedEdited(aSpan)) {
				//no previous edit
				SetCaptionsStyle(aSpan);
			} else {
				//There was a previous edit so must set back to correct style
				SetCorrectedStyle(aSpan);
			}
		}
	}
}

/*****************************************************/
/*****************************************************/
function getEditNode() {

	var returnVal = null;
	var tmpNode = document.f1.t1;
	if ((tmpNode != null) && (tmpNode.parentNode != null)) {
		returnVal = tmpNode;
	}
	return returnVal;
}



/*****************************************************/
/*****************************************************/
// -1 = error
// 0 = stale
// 1 = not stale
function checkForPossibleStaleEdit(start, end) {

	var returnVal = -1;
	//First, make sure the start and end are in the same paragraph since cross-paragraph corrections are not allowed and certainly indicate a stale operation.
	if (document.getElementById(start).parentNode !== document.getElementById(end).parentNode) {
		returnVal = 0;
	} else {
		//stale check - start doesn't have a null text element; one past end span doesn't have a null text element
		if ((returnVal = checkForPossibleStaleEditStart(start)) == 1) {
			//now check end
			returnVal = checkForPossibleStaleEditEnd(end);
		} //else returnVal
	}
	
	return returnVal;
}

/*****************************************************/
/*****************************************************/
function checkForPossibleStaleEditEndInclusive(start, end) {
// -1 = error
// 0 = stale
// 1 = not stale

	var returnVal = -1;
	//First, make sure the start and end are in the same paragraph since cross-paragraph corrections are not allowed and certainly indicate a stale operation.
	if (document.getElementById(start).parentNode !== document.getElementById(end).parentNode) {
		returnVal = 0;
	} else {
		if ((returnVal = checkForPossibleStaleEditStart(start)) == 1) {
			//now check end  (same check as start)
			returnVal = checkForPossibleStaleEditStart(end);
		} //else returnVal
	}
	return returnVal;
}


/*****************************************************/
/*****************************************************/
function checkForPossibleStaleEditStart(start) {
// -1 = error
// 0 = stale
// 1 = not stale

	var returnVal = -1;
	var aSpan;

	//stale check - start doesn't have a null text element; one past end span doesn't have a null text element
	if ((aSpan = document.getElementById(start)) != null) {
		if ((aSpan.firstChild == null) || (aSpan.firstChild.textContent == "")) {
			// must have gotten swallowed up by a new edit group or a deleteAll and we are stale
			returnVal = 0;
		} else {
			returnVal = 1;
		}
	} //else error- should not get a null
	
	return returnVal;
}

/*****************************************************/
/*****************************************************/
function checkForPossibleStaleEditEnd(end) {
// -1 = error
// 0 = stale
// 1 = not stale

	var returnVal = -1;
	var aSpan;

	if ((aSpan = document.getElementById(end)) != null) {
		//we could be off the end of the paragraph - okay
		// or
		//careful....could be an input box from a non-overlapping editing - okay
		// or
		//we get a span and check it is still there
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


/*****************************************************/
/*****************************************************/
function applyEditToRange(start, end, text, initials) {

	var j;
	var tmpTtl;
	var aSpan;
	
	for (j = start; j <= end; j++) {
		if ((aSpan = document.getElementById(j)) != null) {
			// remove all text elements of spans in range
			while (aSpan.firstChild != null) {
				aSpan.removeChild(aSpan.firstChild);
			}

			//if first span, put in new text
			if (j == start) {
				aSpan.appendChild(document.createTextNode(text));
			}

			//set attribute to indicate who edited this span
			setSpanEditor(aSpan, initials);
			
			//set flag to indicate it should show as an edit
			markSpanEdited(aSpan);
			
			//clear locked indicator
			aSpan.removeAttribute("name"); 

			//unhide if it was hidden
			unhideElement(aSpan);
			
			//set style to indicate it was corrected
			SetCorrectedStyle(aSpan);
		}
	}
}

/*****************************************************/
/*****************************************************/
function unhideElement(aSpan) {

	if (aSpan != null) {
		//aSpan.style.display='inline';
		aSpan.style.display="";
	}
}

/*****************************************************/
/*****************************************************/
function hideElement(aSpan) {

	if (aSpan != null) {
		//aSpan.style.display='inline';
		aSpan.style.display="none";
	}
}


/*****************************************************/
/*****************************************************/
function markSpanEdited(aSpan) {

	if (aSpan != null) {
		aSpan.setAttribute("cccEdited", "true"); 
	}
}

/*****************************************************/
/*****************************************************/
function spanIsMarkedEdited(aSpan) {

	var returnVal = false;
	if ((aSpan != null) && (aSpan.getAttribute("cccEdited") == "true")) {
		returnVal = true;
	}
	return returnVal;
}

/*****************************************************/
/*****************************************************/
function setSpanEditor(aSpan, who) {
	//mark the initials of the editor

	var tmpTtl;
	//set title attribute to indicate who edited this span
	tmpTtl = aSpan.getAttribute("title");
	if (tmpTtl == null) {
		//first time editing
		tmpTtl = who;
	} else {
		////It's been edited before; append this editor
		//tmpTtl += "," + who;
		//It's been edited before; add this editor if not already there
		tmpTtl += "," + who;
	}
	aSpan.setAttribute("title", tmpTtl);
}


/*****************************************************/
/*****************************************************/
function SetCorrectedStyle(spanElement) {

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
/*****************************************************/
/*****************************************************/
function SetCaptionsStyle(spanElement) {

	if (spanElement != null) {
		spanElement.className = "";
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

/*****************************************************/
/*****************************************************/
function SetLockStyle(spanElement) {

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



/*****************************************************/
/*****************************************************/
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
		
		for (var i = 0; i < styleElem.cssRules.length; i++) {
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


// The functions below are used to trigger AJAX to check for new captions or corrections every 3 seconds
function timeout_trigger() {
	// Call ajax
	var x1 = 'f='+CorrectionPosition+'&c='+CurrentPosition+'&roomid='+myroomid+"&ms=" + new Date().getTime();
	//alert(CurrentPosition);
	var res = xmlhttpPostCaptions('testajax.php',x1);
	//alert('a');
	setTimeout('timeout_trigger()', 3000);
}

function timeout_init() {
	setTimeout('timeout_trigger()', 3000);
}


function scrollDown() {
	scrollingIsOn = 1;
	prevScrollTop = 0;
}

function showCaptionsMessage() {
var inputElem = document.getElementById("ShowScroll");
	if (inputElem != null) {
		//inputElem.style.zIndex="2";
		//document.f1.style.zIndex="1";
		inputElem.style.display="block";
	}
}

function hideCaptionsMessage() {
	var inputElem = document.getElementById("ShowScroll");
	if (inputElem != null) {
		//inputElem.style.zIndex="0";
		//document.f1.style.zIndex="1";
		inputElem.style.display="none";
	}
	
	//document.f1.CapsBelow.style.zIndex="0";
}

var scrollingTimerEvent;
var scrollingTurnedOff = false;
var prevScrollTop = 0;
var scrollingIsOn = 1;
var CaptionsHaveChanged = 0;   // this variable to be set to 1 by each back-end JavaScript call that changes the captions

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function ScrollingPage()
    {
	
	if (scrollingTurnedOff == true) {
		hideCaptionsMessage();
		return;
	}
	
    var docEle = document.documentElement;
    var newScrollTop = Math.max(docEle.scrollTop, document.body.scrollTop);
    var scrollOverflow = docEle.scrollHeight - (newScrollTop + docEle.clientHeight);
    
    if (newScrollTop < prevScrollTop && scrollOverflow > 5 && CaptionsHaveChanged == 0)
        scrollingIsOn = 0;
    if (scrollOverflow < 3)
        scrollingIsOn = 1;
    
    if (scrollingIsOn > 0)
        {
        window.scrollBy(0, Math.max(1, scrollOverflow / 10));
        prevScrollTop = Math.max(docEle.scrollTop, document.body.scrollTop);
        }
    
    scrollingTimerEvent = setTimeout('ScrollingPage()',50);
    CaptionsHaveChanged = 0;
	
	if (scrollingIsOn == 0) {
		showCaptionsMessage();
	} else {
		hideCaptionsMessage();
	}
}


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

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
function saveSettings(selection) {
	setColor(selection);
	scrollingTurnedOff = document.getElementById('scrolling').checked;
	if (scrollingTurnedOff == false) {
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
		//document.getElementById("HLSetSize").value = captionOrig_fs;  //****
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
		//document.getElementById("CCSetSize").value = captionOrig_fs;  //****
		document.getElementById("CorrectedCaptionsBold").checked = fontWeightCheckbox;
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
	
	for (var i = 0; i < styleElem.cssRules.length; i++) {
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
			stylesUpdated++;
		}
		if (stylesUpdated >= NUMITEMS) break;
	}

}
</script>



 <script>
 //this code put in to trap key events outside the <body> i.e. in the window but not in the body
 //Particularly important to stop ESC from causing the broswer (IE) to stop loading the page thereby shutting 
 //down the comet iframe process.
 
	window.document.onkeydown = function (eventRef)
	{
		if ( !eventRef )
			eventRef = event;

		var keyStroke = (eventRef.keyCode) ? eventRef.keyCode : ((eventRef.charCode) ? eventRef.charCode : eventRef.which);

		if ( keyStroke == 27 )
			return false;
	}

</script>

<script src="js/201a.js"></script>

</head>


<!--***********************************
***********   BODY ****************************
***************************************
-->
<body onkeydown="SetKeyDown(event);" onkeyup="SetKeyUp(event);"  
<? if ($IsMobile==0){ 
	//echo 'onload="document.getElementById(\'comet_iframe\').src=\'comet?id='.$roomid.'\'"';
	echo 'onload="initVars(0); loadIframe(\'comet?id=' . $roomid . '\')"';
} else {
	echo 'onload="initVars(0); timeout_init();"';
}?>
 >



<!--***  CAPTIONS    ***************
***********   Captions ****************************
***************************************
-->

<div id="capcontent" class="caption">

<?
	if(strcmp(md5($pwd),$AuthPWD)==0){ // This is for correctors only
		echo '<form id=f1capcontent name=f1 onsubmit="return false;" onmousedown="SetDown(event);" onmouseup="SetUp(event);"></form>';
	}
	else{ // This is for participants only
		echo '<form id=f1capcontent name=f1 onsubmit="return false;"></form>';
	}

?>

</div>



<!--***********************************
***********   Autoscroll Message ****************************
***************************************
-->

<div id="ShowScroll" style="display:none; position:fixed; right:0px; bottom:0px;">
<input type='button' name='CapsBelow' id='CapsBelowID' value='Auto-scroll OFF. Click to turn on autoscroll' onclick="scrollDown();">
</div>

<div id="testtext" class="divtest"><span id="sizetext" class="caption"></span></div>

<!--//////////////////////////////////////////////
//////////////////  settings icon  ///////////////////
/////////////////////////////////////////////////
-->

<div id="SettingsIcon" style="cursor:pointer; position:fixed; right:0px; top:0px;" onclick="loadCurrentSettings(255);document.getElementById('Settings').style.display='block';"><img src="images/settings.png"></div>


<!--//////////////////////////////////////////////
//////////////////  settings  ///////////////////
/////////////////////////////////////////////////
-->
<div id="Settings" style="position:fixed; box-shadow:1px 1px 10px #000; padding:3px; right:0px; top:0px; display:none; background-color:#CAFFFD; color:#000; width:500px; height:350px; font-size:18px;">

	<input type="radio" Checked name="CaptionSection" onclick="document.getElementById('CaptionsStyle').style.display='block';document.getElementById('SelectedCaptionsStyle').style.display='none';document.getElementById('CorrectedCaptionsStyle').style.display='none';">Captions
	<input type="radio" name="CaptionSection" onclick="document.getElementById('SelectedCaptionsStyle').style.display='block';document.getElementById('CaptionsStyle').style.display='none';document.getElementById('CorrectedCaptionsStyle').style.display='none';">Selected Text
	<input type="radio" name="CaptionSection" onclick="document.getElementById('CorrectedCaptionsStyle').style.display='block';document.getElementById('CaptionsStyle').style.display='none';document.getElementById('SelectedCaptionsStyle').style.display='none';">Corrected Text
	&nbsp;<input type="checkbox" id="scrolling" >Turn Off Scrolling
	<hr>
	
	<div id="colorpicker201" class="colorpicker201"></div>
	
	<!--//////////////////////////////////////////////
//////////////////  caption settings  ///////////////////
/////////////////////////////////////////////////
-->

	<div id="CaptionsStyle" style="display:block;">
		Background Color: <div id="SetBGbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FFFFFF; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetBG','SetBGbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetBG" id="SetBG" value="#FFFFFF" onchange="document.getElementById('SetBGbutton').style.background=document.getElementById('SetBG').value;"><br><br>
		
		Font Color: <div id="SetFCbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#000000; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetFC','SetFCbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetFC" id="SetFC" value="#000000" onchange="document.getElementById('SetFCbutton').style.background=document.getElementById('SetFC').value;"><br><br>
		Font Face: <select id="Fface">
				<option class="font1" value="Arial" >Arial</option>
				<option class="font2" value="Monospace" >Monospace</option>
				<option class="font3" value="Lucida Sans Unicode" >Lucida Sans Unicode</option>
				<option class="font4" value="Times New Roman" >Times New Roman</option>
		</select><br><br>
		<!--HighLight Color: <input onclick="showColorGrid2('SetHL','SetHL');" name="SetHL" id="SetHL" value="#FFFF00"><br>-->
		<!--Correction Color: <input onclick="showColorGrid2('SetCC','SetCC');" name="SetCC" id="SetCC" value=" #FF0000"><br>-->
		<input type="checkbox" id="CaptionsBold" value="Bold"> Bold <br><br>
		
		Font Size:  <select id="SetSize">
							<option class="size1" value="18px">18 pixels</option>
							<option class="size2" value="24px">24 pixels</option>
							<option class="size3" value="32px">32 pixels</option>
							<option class="size4" value="42px">42 pixels</option>
							<option class="size5" value="54px">54 pixels</option>
						</select><br><br>
		<input type=button value="Save Settings" onclick="saveSettings(0)"> <input type=button value="Cancel" onclick="document.getElementById('Settings').style.display='none';">  <input type=button value="Restore Default" onclick="initTempVars(1);">
	</div>

<!--//////////////////////////////////////////////
//////////////////  locked settings  ///////////////////
/////////////////////////////////////////////////
-->
	<div id="SelectedCaptionsStyle" style="display:none;">
		Background Color: <div id="SetHLbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FFFF00; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetHL','SetHLbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetHL" id="SetHL" value="#FFFF00" onchange="document.getElementById('SetHLbutton').style.background=document.getElementById('SetHL').value;"><br><br>
		
		Font Color: <div id="SetHLFCbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#000000; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetHLFC','SetHLFCbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetHLFC" id="SetHLFC" value="#000000" onchange="document.getElementById('SetHLFCbutton').style.background=document.getElementById('SetHLFC').value;"><br><br>
		Font Face: <select id="SelectedFface">
				<option class="font1" value="Arial" >Arial</option>
				<option class="font2" value="Monospace" >Monospace</option>
				<option class="font3" value="Lucida Sans Unicode" >Lucida Sans Unicode</option>
				<option class="font4" value="Times New Roman" >Times New Roman</option>
						</select><br><br>
		<div id="colorpicker201" class="colorpicker201"></div>
		<input type="checkbox" id="HLCaptionsBold"> Bold <br><br>
		<!--Font Size: <select id="HLSetSize">
							<option class="size1" value="18px">18 pixels</option>
							<option class="size2" value="24px">24 pixels</option>
							<option class="size3" value="32px">32 pixels</option>
							<option class="size4" value="42px">42 pixels</option>
							<option class="size5" value="54px">54 pixels</option>
						</select><br><br>-->
		<input type=button value="Save Settings" onclick="saveSettings(0)"> <input type=button value="Cancel" onclick="document.getElementById('Settings').style.display='none';"> <input type=button value="Restore Default" onclick="initTempVars(2);">
	</div>
	
	
<!--//////////////////////////////////////////////
//////////////////  corrected settings  ///////////////////
/////////////////////////////////////////////////
-->
	<div id="CorrectedCaptionsStyle" style="display:none;">
		Background Color: <div id="SetCCBGbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FFFFFF; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetCCBG','SetCCBGbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetCCBG" id="SetCCBG" value="#FFFFFF" onchange="document.getElementById('SetCCBGbutton').style.background=document.getElementById('SetCCBG').value;"><br><br>
		
		Font Color: <div id="SetCCbutton" style="position:relative; border-radius:8px; border-style: solid; border-bottom-color: #333333; border-right-color: #555555; border-left-color: #BBBBBB; border-top-color: #DDDDDD; cursor:pointer; padding:1px; background-color:#FF0000; width:30px; height:30px; display:inline;" onclick="showColorGrid2('SetCC','SetCCbutton');"> &nbsp; &nbsp; &nbsp; </div> &nbsp; <input name="SetHLFC" id="SetCC" value="#FF0000" onchange="document.getElementById('SetCCbutton').style.background=document.getElementById('SetCC').value;"><br><br>
		Font Face: <select id="CorrectedFface">
				<option class="font1" value="Arial" >Arial</option>
				<option class="font2" value="Monospace" >Monospace</option>
				<option class="font3" value="Lucida Sans Unicode" >Lucida Sans Unicode</option>
				<option class="font4" value="Times New Roman" >Times New Roman</option>
						</select><br><br>
		<div id="colorpicker201" class="colorpicker201"></div>
		<input type="checkbox" id="CorrectedCaptionsBold"> Bold <br><br>
		<!--Font Size: <select id="CCSetSize">
							<option class="size1" value="18px">18 pixels</option>
							<option class="size2" value="24px">24 pixels</option>
							<option class="size3" value="32px">32 pixels</option>
							<option class="size4" value="42px">42 pixels</option>
							<option class="size5" value="54px">54 pixels</option>
						</select><br><br>-->
		<input type=button value="Save Settings" onclick="saveSettings(0)"> <input type=button value="Cancel" onclick="document.getElementById('Settings').style.display='none';">  <input type=button value="Restore Default" onclick="initTempVars(3);">
	</div>
	
</div>


<!--//////////////////////////////////////////////
//////////////////  iframe  ///////////////////
/////////////////////////////////////////////////
-->



<?

if ($IsMobile==0){
?>
<div id="iframeDiv" class="iframeDiv"></div>
	<!--<iframe id="comet_iframe" name="comet_iframe" src="" frameborder="1"
		style="frameborder=0;width:600px;height:150px;position:absolute;top:-1000px"></iframe>
		-->
<?}?> 
	<!--<iframe id="comet_iframe" name="comet_iframe" src="comet" width="900" height="400" frameborder="1"></iframe>-->
 
 
 
 
</body>




</html>

