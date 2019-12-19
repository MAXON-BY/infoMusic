

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

function ifstop(in_obj, input)
{
  var playlist_html = ""

  $("#button_stop").prop('disabled', true);
  $("#button_stop").hide()
  $("#button_play").prop('disabled', false);
  $("#button_play").show()
  $("#button_next").prop('disabled', true);
  $("#button_prev").prop('disabled', true);
  $("#lblmpdVolume").html(in_obj.volume);
  $("#mpdVolume").prop('value', in_obj.volume);
  $("#mpd_status").html(" Статус: stop ");
  $("#mpd_playnow").html("  ");
  if (input == 0)
  {
    $.each(in_obj.playlist, function( key, value ) {
      playlist_html = playlist_html + "<div class='playlist-item'><div class='playlist-item-name'><span class='song-music'>"+value+"</span></div></div>"
    })
    $("#current_playlist").html(playlist_html);
  }

}

function ifplay(in_obj, input)
{
  var playlist_html = ""

  $("#button_stop").prop('disabled', false);
  $("#button_stop").show()
  $("#button_play").prop('disabled', true);
  $("#button_play").hide()
  $("#button_next").prop('disabled', false);
  $("#button_prev").prop('disabled', false);
  $("#lblmpdVolume").html(in_obj.volume);
  $("#mpdVolume").prop('value', in_obj.volume);
  $("#mpd_status").html( " Статус: play " );
  // Эта жесть всего-навсего показывает длительность игры / длительность файла
  $("#mpd_playnow").html(" Сейчас играет: <span>"+in_obj.file+"<span>"+ Math.floor(in_obj.elapsed/60)+":"+parseInt(in_obj.elapsed%60)+" / "+Math.floor(in_obj.duration/60)+":"+parseInt(in_obj.duration%60)+"</span></span> ");
  if (input == 0)
  {
    $.each(in_obj.playlist, function( key, value ) {
      playlist_html = playlist_html + "<div class='playlist-item'><div class='playlist-item-name'><span class='song-music'>"+value+"</span></div></div>"
    })
    $("#current_playlist").html(playlist_html);
  }
}

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
          ifstop(obj, 0);
        }
        if (obj.state == "play")
        {
          ifplay(obj, 0);
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
          ifstop(obj, 1);
        }
        if (obj.state == "play")
        {
          ifplay(obj, 1);
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
          ifstop(obj, 1);
        }
        if (obj.state == "play")
        {
          ifplay(obj, 1);
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
          ifstop(obj, 1);
        }
        if (obj.state == "play")
        {
          ifplay(obj, 1);
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
          ifstop(obj, 1);
        }
        if (obj.state == "play")
        {
          ifplay(obj, 1);
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
      $("#lblmpdVolume").html(obj.volume);
    }
  });
}
)
