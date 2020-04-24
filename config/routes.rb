Rails.application.routes.draw do
  root 'users#index'

  devise_for :users, :controllers => { sessions: 'users/sessions' }
  resources :users
  resources :groups
  resources :companies, except: :show
  resources :dests
  resources :areas, except: :show
  resources :regions, except: :show
  get '/shift_users/main', as: 'shift_users_main'

  scope :api do
    get '/shift_users/get_shift_users'
    post '/shift_users/save_shift_users', to: 'shift_users#save_shift_users'
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
