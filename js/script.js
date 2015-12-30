$(function(){
	function resetGame(){
		$('#currentGuess').val('');
		$('#currentGuess').prop('disabled',false);
		$('#results').css('display','none');
		clearInterval(window.timerId);
		$('#currentGuess').focus();
		window.timerId=-1;
		$('#timer').html('30');
		$('#currentGuesses').html('0');
		window.wrongChampions=[]
	}
	resetGame();
	
    $('#restart').click(function(){
		resetGame();
	});
	$('#end').click(function(){
		$('#timer').html('1');
	});
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	function dumbDownName(name){
		return name.toLowerCase().replace(" ",'').replace("'","").replace(".",'');
	}
	$('#skip').click(function(){
		pickNewChampion(false);
		$('#currentGuess').focus();
		
	})
	window.timerId=-1;
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
	
	function pickNewChampion(hasGuessed){
		if(hasGuessed==false){
			window.wrongChampions.push(window.currentChampion['name']+"-"+window.currentChampion["title"]);
			$('#timer').html(parseInt($('#timer').html())-10);
			
		}
		if($('#repeat').prop('checked')==false){
			window.champions=_.without(window.champions,window.currentChampion);
			console.log(_.size(window.champions));
		}
		if(_.size(window.champions)!=0){
		championChosen=Math.floor(Math.random()*_.size(window.champions));
		window.currentChampion=window.champions[championChosen]; //black magics
		$('#champion-title').html(capitalizeFirstLetter(window.currentChampion['title']));
		$('#currentGuess').val('');
		}
		else{
			alert("You have guessed all the champions. Congrats!");
			$('#timer').html('1');
		}
	}
$('#currentGuess').on('keyup',function(event){
	if(event.key=="Enter" || event.keyCode==13){
		pickNewChampion(false);
	}
	console.log(event);
	if(window.timerId==-1){
		 window.timerId=setInterval(function(){
			 $('#timer').html(parseInt($('#timer').html())-1);
			 if($('#timer').html()<=0){
				 window.wrongChampions.push(window.currentChampion['name']+" - "+window.currentChampion["title"]); 
				 clearInterval(window.timerId);
				 $('#currentGuess').prop('disabled',true);
				 $('#results').css('display','inline-block');
				 $('#wrong-champs').html(window.wrongChampions.join("<br>"));
			 }
	},1000);
	}
		 if(dumbDownName($('#currentGuess').val())==dumbDownName(window.currentChampion['name'])){
			 pickNewChampion(true);
			 $('#timer').html(parseInt($('#timer').html())+2);
			
			 $('#currentGuesses').html(parseInt($('#currentGuesses').html())+1);
			 
		 }
		 //console.log($('#currentGuess').val()+"=="+dumbDownName(window.currentChampion['name']));
	
	
});
});