

//jQuery(document).on('click','.btn-check-mpd', function(e){
jQuery(document).on('click','a.btn-check-mpd', function(e){
      e.preventDefault();
      // alert(jQuery(this).attr('id'));
          $.ajax({
              type:'POST',
              url: '/query_mpd_js/',
              data:{
                  pk:jQuery('input[name=pk]').val(),
                  csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val()
              },
              success: function(data){
                var obj = jQuery.parseJSON(data);
                if (obj.connect == "False"){
                    alert('Соединение отсутствует!');
                  }
                  else {
                    if (obj.state == "stop"){
                      alert('Состояние: стоп. \nГромкость: '+obj.volume+'. \nФайл: '+obj.file);
                    }
                    else {
                      alert('Состояние: проигрывается. \nГромкость: '+obj.volume+'. \nФайл: '+obj.file+". \nИсполнитель: "+obj.artist+".\nКомпозиция: "+obj.title);
                    }
                    // alert(data);
                  }
              }
          });

  });

jQuery(document).on('change', '.checkbox-publish', function(f){
    f.preventDefault();

    // alert(jQuery(this).attr('id')+' '+jQuery('input[name=grid]').val());
    // alert(jQuery('input[name=csrfmiddlewaretoken]').val())
    // alert(jQuery(this).prop('checked'))

    var id_checkbox = jQuery(this).attr('id');
    var id_sw = jQuery(this).attr('id');
    //alert(id_checkbox)

    $.ajax({
        type:'POST',
        url: '/edit_broadcast_grid_js/',
        data:{
            check:jQuery(this).prop('checked'),
            sw:id_sw,
            grid:jQuery('input[name=grid]').val(),
            csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(data){
            var obj = jQuery.parseJSON(data);
            if (obj.rez == "false"){
                //alert(obj.detail);
                $('.alert-danger').show()

                // Почему-то снятие флажка работает только по id
                $('#'+id_checkbox).prop('checked', false);
            }
            else {
                if ($('#'+id_checkbox).is(':checked')) {
                    //alert('#Col_'+id_sw);
                    $('#Col0_'+id_sw).addClass("dis-block");
                    $('#Col1_'+id_sw).addClass("dis-block");
                    $('#Col2_'+id_sw).addClass("dis-block");
                } else {
                    $('#Col0_'+id_sw).removeClass("dis-block");
                    $('#Col1_'+id_sw).removeClass("dis-block");
                    $('#Col2_'+id_sw).removeClass("dis-block");
                }
                $('.alert-success').show()
            }
            //alert(obj.check);
        }
    });

});

$(function(){
    window.setTimeout(function(){
        //$('.alert').alert('close');
        $('.alert').hide()
    },7000);
});

jQuery(document).on('click','a.btn-del-elem', function(e){
    e.preventDefault();
    var id_sw = jQuery(this).attr('id');

        $.ajax({
        type:'POST',
        url: '/del_broadcastcell_js/',
        data:{
            sw:id_sw,
            csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(data){
            var obj = jQuery.parseJSON(data);
            alert('Время вещания ID '+obj.out+' было удалено!');
            location.reload();
        }
    });
});

// Дублируем название файла при нажатии Загрузить файл
$(document).on("change", "input[name=file]", function(e){
    $("#res").val( e.target.files[0].name );
});