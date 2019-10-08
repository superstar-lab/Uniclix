@extends('layouts.auth')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                  <div class="row mb30">
                    <div class="col-md-6">All Posts</div>
                    <div class="col-md-6 text-right">
                      <a href="{{ route('admin.post.create')}}"><button type="button" class="btn btn-primary">Create New Post</button></a>
                    </div>
                  </div>
                </div>

                <div class="card-body">
                  @if(count($posts)>0)
                    <ul class="list-group posts-lists">
                      @foreach($posts as $post)
                      <li class="list-group-item">
                        <div class="row">
                          <div class="col-md-10"><h4>{{$post->title}}</h4></div>
                          <div class="col-md-2 text-right">
                            <a href="{{ route('post.edit', $post->id) }}" class="fleft"><button type="button" class="btn btn-info">Edit</button></a>
                            <form action="{{ route('post.delete', $post->id) }}" method="POST" class="fright">
                              @csrf
                              <button type="submit" class="btn btn-danger"  onclick="deleteFunction()">Delete</button>
                            </form>                            
                          </div>
                        </div>
                      </li>
                      @endforeach
                    </ul>
                  @else
                    <h3 class="text-center">There are still no posts!</h3>
                  @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css">
<script>
    function deleteFunction() {
    event.preventDefault(); // prevent form submit
    var form = event.target.form; // storing the form
      swal({
        title: "Are you sure you want to delete post?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
      function(isConfirm){
        if (isConfirm) {
          form.submit();          // submitting the form when user press yes
        } else {
          swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
      });
    }
</script>
@endpush