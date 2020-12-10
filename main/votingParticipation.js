$( document ).ready(function() {


  $('#clickTo').click(function(){
    $("#list").empty();
      $.ajax({
            type: 'GET',
            url: '/api/election',
            success: function(result) {
              console.log(result);
              let content = '';
              result.forEach(obj => {
                content += `
                <div>
                <p>${obj.y}  ${obj.c}  ${obj.p}%</p>
                </div>
                `
              });
              $("#list").append(content)
            }
        });
  });
})
