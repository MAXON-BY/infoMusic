$('#ModalPlayer').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var recipient = button.data('whatever');
  var songname = button.data('songname');

  var modal = $(this);
  audio = modal.find('#player');
  modal.find('#ModalPlayerTitle').text(songname);
  // var media_uri = "http://93.125.121.153:2748"+recipient;
  // var audio = modal.find('#ModalPlayerSource');
  modal.find('#ModalPlayerSource').attr('src', "http://93.125.121.153:2748"+recipient);

  console.log(modal.find('#ModalPlayerSource').attr('src'));
  audio[0].pause();
  audio[0].load();
})

$('#ModalPlayer').on('hide.bs.modal', function (event)
{
  var modal = $(this);
  audio = modal.find('#player');
  audio[0].pause();
  
})
