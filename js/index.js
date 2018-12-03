function refreshTable1(){
	$.ajax({
		type:"get",
		url:"",
		headers: {
			AUTHORIZATION: $.cookie('token')
		},
		success:function(res){
			
		}
	});
}
