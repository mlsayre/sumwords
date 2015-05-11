json.array!(@games) do |game|
  json.extract! game, :id, :letters
  json.url game_url(game, format: :json)
end
