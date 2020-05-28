let issue = $('form #issue');
let back = $('form #return');
let fineForm = $('form');
let result = $('div#result');
let btn = $('#find');

fineForm.submit(function(e){
	e.preventDefault(); 
})

issue.change(function(){
	result.text('');
})

back.change(function(){
	result.text('');
})

btn.click(function(e){
	let fine = 0;
	if(!issue.val() || !back.val()){
		new Noty({
				theme:'relax',
				text: `Dates can not be empty !`,
				type:'error',
				layout:'topCenter',
				timeout: 2000,
		}).show();

	}else if(issue.val()>back.val()){
		new Noty({
				theme:'relax',
				text: `Issue date must be before return date !`,
				type:'error',
				layout:'topCenter',
				timeout: 2000,
		}).show();

	}else{
	let date_1 = new Date(issue.val());
	let date_2 = new Date(back.val());
	let days = Math.abs((date_2.getTime()-date_1.getTime())/(1000*60*60*24));
	if(days<60){
		fine = 0;
	}else if(days<90){
		fine = (days-60)*1; //1rupee per day
	}else{
		fine = (90-60)+(days-90)*2;
	}
	result.text('Expected fine will be : '+fine+' Rupees/-');
	}
	});

 