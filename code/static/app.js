$(".dropdown-menu li a").click(function(){
    $(this).parents(".dropdown").find('.btn-basin').html($(this).html() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn-basin').val($(this).data('value'));
  });