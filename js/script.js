$(function(){
	//Resets all values necessary so you can play again
	function resetGame(){
		$('#currentGuess').val('');
		$('#currentGuess').prop('disabled',false);
		$('#results').css('display','none');
		clearInterval(window.timerId);
		$('#currentGuess').focus();
		window.timerId=-1;
		$('#timer').html('30');
		 $('#skip').prop('disabled',false);
		$('#currentGuesses').html('0');
		window.wrongChampions=[]
	}
	//Sets the difficulty when stuff happens
	function setDifficulty(){
		diff=$('input[name=difficulty]:checked').val()
		switch(diff){
			case "0":
				//console.log("ez");
				window.timerStart=9999;
				window.onCorrectGuess=9999;
				window.onWrongGuess=0;
				break;
		case "1":
				window.timerStart=60;
				window.onCorrectGuess=10;
				window.onWrongGuess=2;
				break;
		case "2":
				window.timerStart=45;
				window.onCorrectGuess=3;
				window.onWrongGuess=5;
				break;
		case "3":
				window.timerStart=30;
				window.onCorrectGuess=2;
				window.onWrongGuess=10;
				break;
		}
		//console.log("help");
		$('#timer').html(window.timerStart);
		
	}
	
	//Makes typing the name easier for when we're comparing
	function dumbDownName(name){
		return name.toLowerCase().replace(" ",'').replace("'","").replace(".",'');
	}
	
	//Self explainitory
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
	//Picks a new champion for you to guess
	function pickNewChampion(hasGuessed){
		//reduces your timer by 10 if you've guessed it wrong and adds it to wrong champions llist
		if(hasGuessed==false){
			window.wrongChampions.push(window.currentChampion['name']+"-"+window.currentChampion["title"]);
			$('#timer').html(parseInt($('#timer').html())-window.onWrongGuess);
			
		}
		//Removes the champion from the pool of options if the user has enabled that
		if($('#repeat').prop('checked')==false){
			window.champions=_.without(window.champions,window.currentChampion);
			console.log(_.size(window.champions));
		}
		//Picks new champion basically
		if(_.size(window.champions)!=0){
			championChosen=Math.floor(Math.random()*_.size(window.champions));
			window.currentChampion=window.champions[championChosen]; //black magics
			$('#champion-title').html(capitalizeFirstLetter(window.currentChampion['title']));
			$('#currentGuess').val('');
		}
		//Win condition is having 0 champions left
		else{
			alert("You have guessed all the champions. Congrats!");
			$('#timer').html('1');
		}
	}
	
	//Restart button
	$('#restart').click(function(){
		resetGame();
	});
	
	//End run button
	$('#end').click(function(){
		$('#timer').html('1');
	});
	
	//Skip current champion button
	$('#skip').click(function(){
		pickNewChampion(false);
		$('#currentGuess').focus();
		
	});
	$('input[name=difficulty]').change(function(){
		setDifficulty();
	});
	//Handles keypresses in the text field
	$('#currentGuess').on('keyup',function(event){
	//Skips if you press enter
	if(event.key=="Enter" || event.keyCode==13){
		pickNewChampion(false);
	}
	//Basically if the timer hasn't started as you're typing, start it
	if(window.timerId==-1){
		//Basic timing stuff
		 window.timerId=setInterval(function(){
			 $('#timer').html(parseInt($('#timer').html())-1);
			 if($('#timer').html()<=0){
				 //What to do when the timer is over
				 window.wrongChampions.push(window.currentChampion['name']+" - "+window.currentChampion["title"]); 
				 clearInterval(window.timerId);
				 $('#currentGuess').prop('disabled',true);
				 $('#results').css('display','inline-block');
				 $('#wrong-champs').html(window.wrongChampions.join("<br>"));
				 $('#timer').html('0');
				 $('#skip').prop('disabled',true);
			 }
	},1000);
	}
		//If your champion guess is correct
		 if(dumbDownName($('#currentGuess').val())==dumbDownName(window.currentChampion['name'])){
			 pickNewChampion(true);
			 $('#timer').html(parseInt($('#timer').html())+window.onCorrectGuess);
			
			 $('#currentGuesses').html(parseInt($('#currentGuesses').html())+1);
			 
		 }
		 //console.log($('#currentGuess').val()+"=="+dumbDownName(window.currentChampion['name']));
	
	
});
	resetGame();
	setDifficulty();
	//Gets data in
	$.get("champion.json",function(data){
		champs=data['data'];
		window.champions=[];
		count=0;
		/*for(ch in window.champs){
			window.champions[count++]=ch;
		}*/
		window.champions=_.map(champs,function(data){return data;})
		pickNewChampion(true);
	});
	
	

});