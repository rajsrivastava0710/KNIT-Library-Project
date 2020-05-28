let password = $('#pass');
let confirm_pass = $('#c-pass');
password.on('change',function(e){
	if($(this).val().length<5){
		let len = $(this).val().length;
		$(this).val('');
		new Noty({
				theme:'relax',
				text: `Your password had only ${len} characters`,
				type:'error',
				layout:'topCenter',
				timeout: 3000,
		}).show();
	}
});
confirm_pass.on('change',function(){
	if($(this).val()!=password.val()){
		$(this).val('');
		new Noty({
				theme:'relax',
				text: "Passwords do not match !",
				type:'error',
				layout:'topCenter',
				timeout: 3000,
		}).show();
	}
})