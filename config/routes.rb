Rails.application.routes.draw do
  root 'users#index'

  devise_for :users, :controllers => { sessions: 'users/sessions' }
  resources :users
  resources :groups
  resources :companies, except: :show
  resources :dests
  resources :areas, except: :show
  resources :regions, except: :show
  resources :kkbs
  get '/shift_users/main', as: 'shift_users_main'

  scope :api do
    get '/shift_users/shift_table'
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
