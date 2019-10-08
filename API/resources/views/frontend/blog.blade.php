@extends('layouts.homepage')

@section('content')
<div id="banner">
	<div class="container">
		<h1>Blog</h1>
		<p>Manuals take time. These videos will get you started instantly.</p>
	</div>
</div>

<div class="container mt100">
	<?php $counter = 0; ?>
	@foreach($posts as $post)
	<?php 
		if($counter == 0)
		{
			$side="fleft";
		}
		else {
			$side="fright";
		}
	 ?>
	<div class="row mb30">
		<div class="col-xs-12">
			<div class="blog-post panel-shadow">
				<div class="blog-post-image {{$side}}">
					<img src="/post_images/{{$post->image}}" class="img-responsive w100">
				</div>
				<div class="blog-post-content fright">
					<h4>{{$post->title}}</h4>
					<div class="blog-post-date"><span class="blog-post-author">By {{$post->admin->name}}</span><span>{{$post->created_at->format('F d, Y')}}</span></div>
					{!! str_limit($post->content, 190, '...') !!}
					<div class="blog-post-footer">
						<div class="blog-post-share">
							<span class="blog-post-span-1">Share:</span> 
							<span class="blog-post-span-2">
								<ul class="list-inline blog-post-social">
		                            <li><a href="#"><i class="fa fa-facebook"></i></a></li>
		                            <li><a href="#"><i class="fa fa-twitter"></i></a></li>
		                            <li><a href="#"><i class="fa fa-instagram"></i></a></li>
		                        </ul>
                    		</span>
						</div>
						<div class="blog-post-show-more">
							<a href="{{route('article', $post->id)}}" class="theme-btn-transparent">Read more</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php 
		$counter++; 
		if($counter == 2)
		{
			$counter = 0;
		}
	?>
	@endforeach
	<div class="row mb70 text-right">
		<div class="col-xs-12 blog-pagination">
			{{ $posts->links() }}
		</div>
	</div>
</div>

@include('frontend.includes.footer')

@endsection