@extends('layouts.auth')

@section('content')
<div class="container">
    <div class="row">
      <div class="col-xs-12 mb30">
        <h1>Create Post</h1>
      </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-12">
          <form method="POST" action="{{ route('post.edit.store', $post->id) }}" enctype="multipart/form-data">
            @csrf
            <input type="hidden" name="admin_id" value="{{ auth()->user()->id }}">
            <div class="form-group">
              <label>Post Name</label>
              <input type="text" name="title" class="form-control" value="{{ $post->title }}">
            </div>
            <div class="form-group">
              <label>Post Category</label>
              <select name="category_id" class="form-control">
                @foreach($post_categories as $category)
                  @if($category->id == $post->category_id)
                    <option value="{{ $category->id }}" selected="selected">{{ $category->category_name }}</option>
                  @else
                    <option value="{{ $category->id }}">{{ $category->category_name }}</option>
                  @endif                  
                @endforeach
              </select>
            </div>            
            <div class="form-group">
              <select multiple="multiple" name="tags[]" id="tags">
              @foreach($tags as $tag)
                  @if(in_array($tag->id, $post->tags->pluck('id')->toArray()))
                    <option value="{{$tag->id}}" selected="selected">{{$tag->tag_name}}</option>
                  @else
                    <option value="{{$tag->id}}">{{$tag->tag_name}}</option>
                  @endif
              @endforeach
              </select>
            </div>
            <div class="form-group">
                <label>Post Image</label>
                <div class="img-uploader">                        
                    <div class="img-upload-click">
                      <img src="/post_images/{{$post->image}}">                         
                    </div>
                    <input type="file" name="image" id="image_path" class="form-control img-upload-input">
                </div>
            </div>
            <div class="form-group">
              <label>Post Content</label>
              <textarea name="content" class="tinymce-editor">{{$post->content}}</textarea>
            </div>
            <div class="form-group text-right">
              <input type="submit" name="submit" class="btn btn-primary" value="Save Post">
            </div>
          </form>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
<script>
$(document).ready(function(){
    $("#tags").select2({
      tags: true,
      width: "100%"
    });

   tinymce.init({
      selector: '.tinymce-editor',
      height: 500,
      plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste imagetools wordcount"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code preview ",
      // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css'
      ],
      image_title: true,
      automatic_uploads: true,
      images_upload_url: '{{ route("post.image.store") }}',
      file_picker_types: 'image',
      file_picker_callback: function(cb, value, meta) {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = function() {
              var file = this.files[0];

              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function () {
                  var id = 'blobid' + (new Date()).getTime();
                  var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                  var base64 = reader.result.split(',')[1];
                  var blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name });
              };
          };
          input.click();
      }
    });

    $('.img-upload-click').on('click', function(){
        $(this).parent().find('.img-upload-input').trigger('click');
    });

    $(".img-upload-input").change(function () {
        readURL(this, $(this));
    });

    function readURL(input, object) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            console.log(object);
            reader.onload = function (e) {
               $(object).parent().find('.img-upload-click').html('<img src="' + e.target.result + '">');

            }
            reader.readAsDataURL(input.files[0]);
        }
    }
})
</script>
@endpush