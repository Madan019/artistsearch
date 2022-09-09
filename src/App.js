import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App () {
  const CLIENT_ID = '6012b07d7d7742f9ae4e91d0c81ceeda'
  const REDIRECT_URI =
    'https://631b2769e49fc7006e10ccae--comfy-cocada-6de543.netlify.app'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'

  const [token, setToken] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState([])
  // const [song, setSong] = useState([])

  // const getToken = () => {
  //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
  //     let token = urlParams.get('access_token');
  // }

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        .split('=')[1]

      window.location.hash = ''
      window.localStorage.setItem('token', token)
    }

    setToken(token)
  }, [])

  const logout = () => {
    setToken('')
    window.localStorage.removeItem('token')
  }

  const searchArtists = async e => {
    e.preventDefault()
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: 'artist'
      }
    })

    setArtists(data.artists.items)
    console.log(data.artists)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div>
        <div className='artistDisplay' key={artist.id}>
          {artist.images.length ? (
            <img className='images' src={artist.images[0].url} alt='' />
          ) : (
            <div>No Image</div>
          )}
          <div className='artistInfo'>
            <h3 style={{ textTransform: 'capitalize' }}>{artist.type}</h3>
            <p className='info'>
              Name : {artist.name}
              <br />
              Followers : {artist.followers.total}
              <br />
              Popularity : {artist.popularity}
            </p>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Artist Search App</h1>
        {!token ? (
          <a
            className='btn'
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout} className='btn'>
            Logout
          </button>
        )}

        {token ? (
          <form onSubmit={searchArtists}>
            <div className='form'>
              <input
                className='inputName'
                type='text'
                onChange={e => setSearchKey(e.target.value)}
              />
              <button type={'submit'} className='btn'>
                Search
              </button>
            </div>
          </form>
        ) : (
          <h2>Please login</h2>
        )}

        {renderArtists()}
      </header>
    </div>
  )
}

export default App
