"use client";

import React from "react";

const CataloguePage = () => {
  return (
    <div className="min-h-full bg-black p-6 md:p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
           {["Catalogue"].map((s) => s.toUpperCase()).join(" ")}
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage movies, TV shows and content metadata.
          </p>
        </div>

        <button className="rounded-lg bg-[#FF4C00] cursor-pointer px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ff641f]">
          + Add Content
        </button>

      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Total Movies
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            TV Shows
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Published
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-500">
            0
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Hidden
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-500">
            0
          </h2>
        </div>

      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">

        <input
          type="text"
          placeholder="Search movies or TV shows..."
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#FF4C00]"
        />

        <select className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 outline-none">
          <option>All Types</option>
          <option>Movies</option>
          <option>TV Shows</option>
        </select>

        <select className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 outline-none">
          <option>All Status</option>
          <option>Published</option>
          <option>Hidden</option>
        </select>

      </div>

      {/* Catalogue Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">

        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="font-semibold">
            Content Library
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-4">
                  Title
                </th>

                <th className="px-5 py-4">
                  Type
                </th>

                <th className="px-5 py-4">
                  Genre
                </th>

                <th className="px-5 py-4">
                  Rating
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center text-zinc-600"
                >
                  No content available.
                </td>
              </tr>
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default CataloguePage;