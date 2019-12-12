

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

// play btn on table
$('.panel-play').on("click", function () {
    $('.panel-play').removeClass('panel-pause');
    $(this).toggleClass('panel-pause');
});

// profile edit show
$('#edit-profile').on('click', function () {
    $(this).hide();
    $('.profile-descr-noedit').hide();
    $('.profile-descr-edit').show();
    $('.profile-form').show();
});

// Для кнопки "Управление" на странице объекта
$('#button_control').click(function(){
  var id_object = jQuery(this).attr('data-object-id');
  $.ajax(
    {
      type:'POST',
      url: '/object/'+id_object+'/',
      data:
      {
        csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val()
      },
      success: function(data)
      {
        var obj = jQuery.parseJSON(data);
        console.log(obj);
        if (obj.state == "stop")
        {
          $("#button_stop").prop('disabled', true);
          $("#button_play").prop('disabled', false);
          $("#button_next").prop('disabled', true);
          $("#button_prev").prop('disabled', true);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: стоп <br>Текущая композиция: "+
            obj.file +"</p>" );
        }
        if (obj.state == "play")
        {
          $("#button_stop").prop('disabled', false);
          $("#button_play").prop('disabled', true);
          $("#button_next").prop('disabled', false);
          $("#button_prev").prop('disabled', false);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: играет <br>Проигрывается файл: "+
            obj.file +"</p>" );
        }
      }
    }
  );

});

$('#button_prev').click(function(){
  var id_object = jQuery(this).attr('data-object-id');
  $.ajax(
    {
      type:'POST',
      url: '/mpd_prev_next/',
      data:
      {
        csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val(),
        object:id_object,
        control:'prev'
      },
      success: function(data)
      {
        var obj = jQuery.parseJSON(data);
        console.log(obj);
        if (obj.state == "stop")
        {
          $("#button_stop").prop('disabled', true);
          $("#button_play").prop('disabled', false);
          $("#button_next").prop('disabled', true);
          $("#button_prev").prop('disabled', true);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: стоп <br>Текущая композия: "+
            obj.file +"</p>" );
        }
        if (obj.state == "play")
        {
          $("#button_stop").prop('disabled', false);
          $("#button_play").prop('disabled', true);
          $("#button_next").prop('disabled', false);
          $("#button_prev").prop('disabled', false);
          $("#mpd_status").html( "<p>Состояние: играет <br>Проигрывается файл: "+
            obj.file +"</p>" );
        }
      }
    }
  );
});

$('#button_play').click(function(){
  var id_object = jQuery(this).attr('data-object-id');
  $.ajax(
    {
      type:'POST',
      url: '/mpd_play/',
      data:
      {
        csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val(),
        object:id_object
      },
      success: function(data)
      {
        var obj = jQuery.parseJSON(data);
        console.log(obj);
        if (obj.state == "stop")
        {
          $("#button_stop").prop('disabled', true);
          $("#button_play").prop('disabled', false);
          $("#button_next").prop('disabled', true);
          $("#button_prev").prop('disabled', true);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: стоп <br>Текущая композия: "+
            obj.file +"</p>" );
        }
        if (obj.state == "play")
        {
          $("#button_stop").prop('disabled', false);
          $("#button_play").prop('disabled', true);
          $("#button_next").prop('disabled', false);
          $("#button_prev").prop('disabled', false);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: играет <br>Проигрывается файл: "+
            obj.file +"</p>" );
        }
      }
    }
  );
});

$('#button_stop').click(function(){
  var id_object = jQuery(this).attr('data-object-id');
  $.ajax(
    {
      type:'POST',
      url: '/mpd_stop/',
      data:
      {
        csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val(),
        object:id_object
      },
      success: function(data)
      {
        var obj = jQuery.parseJSON(data);
        console.log(obj);
        if (obj.state == "stop")
        {
          $("#button_stop").prop('disabled', true);
          $("#button_next").prop('disabled', true);
          $("#button_prev").prop('disabled', true);
          $("#button_play").prop('disabled', false);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: стоп <br>Текущая композия: "+
            obj.file +"</p>" );
        }
        if (obj.state == "play")
        {
          $("#button_stop").prop('disabled', false);
          $("#button_play").prop('disabled', true);
          $("#button_next").prop('disabled', false);
          $("#button_prev").prop('disabled', false);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: играет <br>Проигрывается файл: "+
            obj.file +"</p>" );
        }
      }
    }
  );
});

$('#button_next').click(function(){
  var id_object = jQuery(this).attr('data-object-id');
  $.ajax(
    {
      type:'POST',
      url: '/mpd_prev_next/',
      data:
      {
        csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val(),
        object:id_object,
        control:'next'
      },
      success: function(data)
      {
        var obj = jQuery.parseJSON(data);
        console.log(obj);
        if (obj.state == "stop")
        {
          $("#button_stop").prop('disabled', true);
          $("#button_play").prop('disabled', false);
          $("#button_next").prop('disabled', true);
          $("#button_prev").prop('disabled', true);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: стоп <br>Текущая композия: "+
            obj.file +"</p>" );
        }
        if (obj.state == "play")
        {
          $("#button_stop").prop('disabled', false);
          $("#button_play").prop('disabled', true);
          $("#button_next").prop('disabled', false);
          $("#button_prev").prop('disabled', false);
          $("#lblmpdVolume").html("Громкость: "+obj.volume);
          $("#mpdVolume").prop('value', obj.volume);
          $("#mpd_status").html( "<p>Состояние: играет <br>Проигрывается файл: "+
            obj.file +"</p>" );
        }
      }
    }
  );
});

$('#mpdVolume').change(function()
{
  var id_object = jQuery(this).attr('data-object-id');
  $.ajax({
    type:'POST',
    url: '/mpd_change_volume/',
    data:
    {
      csrfmiddlewaretoken:jQuery('input[name=csrfmiddlewaretoken]').val(),
      object:id_object,
      volume:jQuery(this).val()
    },
    success: function(data)
    {
      var obj = jQuery.parseJSON(data);
      console.log(obj);
      $("#lblmpdVolume").html("Громкость: "+obj.volume);
    }
  })
}
)
