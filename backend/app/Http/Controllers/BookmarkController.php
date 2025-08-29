<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Http\Requests\BookmarkRequest;
use App\Http\Resources\BookmarkResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BookmarkController extends Controller
{
    /**
     * Display a listing of the user's bookmarks.
     */
    public function index(Request $request)
    {
        $bookmarks = $request->user()
            ->bookmarks()
            ->orderBy('created_at', 'desc')
            ->get();

        return BookmarkResource::collection($bookmarks);
    }

    /**
     * Store a newly created bookmark.
     */
    public function store(BookmarkRequest $request)
    {
        $bookmark = $request->user()->bookmarks()->create($request->validated());

        return new BookmarkResource($bookmark);
    }

    /**
     * Display the specified bookmark.
     */
    public function show(Request $request, Bookmark $bookmark)
    {
        $this->authorize('view', $bookmark);

        return new BookmarkResource($bookmark);
    }

    /**
     * Update the specified bookmark.
     */
    public function update(BookmarkRequest $request, Bookmark $bookmark)
    {
        $this->authorize('update', $bookmark);

        $bookmark->update($request->validated());

        return new BookmarkResource($bookmark);
    }

    /**
     * Remove the specified bookmark.
     */
    public function destroy(Request $request, Bookmark $bookmark)
    {
        $this->authorize('delete', $bookmark);

        $bookmark->delete();

        return response()->json([
            'message' => 'Bookmark deleted successfully'
        ], Response::HTTP_OK);
    }
}