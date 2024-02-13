/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const query = {
      text: `SELECT 
                playlists.id, 
                playlists.name, 
                ARRAY_AGG(
                JSON_BUILD_OBJECT(
                    'id', songs.id,
                    'title', songs.title,
                    'performer', songs.performer
                )
                ORDER BY songs.title ASC
                ) as songs
            FROM playlists_songs
            INNER JOIN playlists ON playlists_songs.playlist_id = playlists.id
            INNER JOIN songs ON playlists_songs.song_id = songs.id
            WHERE playlist_id = $1
            GROUP BY playlists.id`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = PlaylistsService;
