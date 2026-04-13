import React from "react";
import { Profile, EditProfile, Avatar, AddPlacePopup, DeleteConfirmPopup } from "./components/Profile";
import { getUserInfo, setUserInfo, setUserAvatar, getCardList, addNewCard, deleteCard, putLike, deleteLike } from "./utils/api";
import mainLogo from './assets/logo.svg';

interface ICardData {
  _id: string;
  name: string;
  link: string;
  likes: { _id: string }[];
  owner: { _id: string };
  createdAt: string;
}

interface AppState {
  isEditProfileVisible: boolean;
  isAvatarVisible: boolean;
  isAddPlaceVisible: boolean;
  isDeleteConfirmVisible: boolean;
  isImageVisible: boolean;
  isStatsVisible: boolean;
  userName: string;
  userDescription: string;
  avatarUrl: string;
  userId: string;
  cards: ICardData[];
  selectedCardForDelete: ICardData | null;
  selectedImage: { src: string; caption: string };
  isLoading: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isEditProfileVisible: false,
      isAvatarVisible: false,
      isAddPlaceVisible: false,
      isDeleteConfirmVisible: false,
      isImageVisible: false,
      isStatsVisible: false,
      userName: "",
      userDescription: "",
      avatarUrl: "",
      userId: "",
      cards: [],
      selectedCardForDelete: null,
      selectedImage: { src: '', caption: '' },
      isLoading: true
    };
  }

  componentDidMount() {
    Promise.all([getUserInfo(), getCardList()])
      .then(([userData, cardsData]) => {
        this.setState({
          userName: userData.name,
          userDescription: userData.about,
          avatarUrl: userData.avatar,
          userId: userData._id,
          cards: cardsData.reverse(),
          isLoading: false
        });
      })
      .catch((err) => {
        console.error('Ошибка загрузки данных:', err);
        this.setState({ isLoading: false });
      });
  }

  handleEditProfileClick = () => this.setState({ isEditProfileVisible: true });
  handleAvatarClick = () => this.setState({ isAvatarVisible: true });
  handleAddPlaceClick = () => this.setState({ isAddPlaceVisible: true });
  handleStatsClick = () => this.setState({ isStatsVisible: true });
  
  closeAllPopups = () => this.setState({
    isEditProfileVisible: false,
    isAvatarVisible: false,
    isAddPlaceVisible: false,
    isDeleteConfirmVisible: false,
    isImageVisible: false,
    isStatsVisible: false,
    selectedCardForDelete: null,
    selectedImage: { src: '', caption: '' }
  });

  handleUpdateUser = (name: string, desc: string) => {
    setUserInfo(name, desc)
      .then((userData) => {
        this.setState({
          userName: userData.name,
          userDescription: userData.about
        });
        this.closeAllPopups();
      })
      .catch((err) => console.error('Ошибка профиля:', err));
  };

  handleUpdateAvatar = (url: string) => {
    setUserAvatar(url)
      .then((userData) => {
        this.setState({ avatarUrl: userData.avatar });
        this.closeAllPopups();
      })
      .catch((err) => console.error('Ошибка аватара:', err));
  };

  handleAddCard = (name: string, link: string) => {
    addNewCard(name, link)
      .then((newCard) => {
        this.setState({ cards: [newCard, ...this.state.cards] });
        this.closeAllPopups();
      })
      .catch((err) => console.error('Ошибка добавления карточки:', err));
  };

  handleDeleteCardRequest = (card: ICardData) => {
    this.setState({
      isDeleteConfirmVisible: true,
      selectedCardForDelete: card
    });
  };

  confirmDeleteCard = () => {
    const { selectedCardForDelete } = this.state;
    if (!selectedCardForDelete) return;

    deleteCard(selectedCardForDelete._id)
      .then(() => {
        this.setState({
          cards: this.state.cards.filter(c => c._id !== selectedCardForDelete._id),
          isDeleteConfirmVisible: false,
          selectedCardForDelete: null
        });
      })
      .catch((err) => console.error('Ошибка удаления карточки:', err));
  };

  handleLikeCard = (card: ICardData) => {
    const isLiked = card.likes.some(like => like._id === this.state.userId);
    const likeRequest = isLiked ? deleteLike(card._id) : putLike(card._id);

    likeRequest
      .then((updatedCard) => {
        this.setState({
          cards: this.state.cards.map(c => c._id === card._id ? updatedCard : c)
        });
      })
      .catch((err) => console.error('Ошибка лайка:', err));
  };

  handleImageClick = (src: string, caption: string) => {
    this.setState({ selectedImage: { src, caption }, isImageVisible: true });
  };

  render() {
    if (this.state.isLoading) {
      return <div className="loading">Загрузка...</div>;
    }

    return (
      <div className="page">
        <div className="page__content">
          <header className="header page__section">
            <img 
              src={mainLogo} 
              alt="Логотип проекта место" 
              className="logo header__logo" 
              onClick={this.handleStatsClick}
              style={{ cursor: 'pointer' }}
            />
          </header>
          
          <main className="content">
            <Profile
              name={this.state.userName}
              description={this.state.userDescription}
              avatar={this.state.avatarUrl}
              onEditProfile={this.handleEditProfileClick}
              onEditAvatar={this.handleAvatarClick}
              onAddPlace={this.handleAddPlaceClick}
            />
            <section className="places page__section">
              <ul className="places__list">
                {this.state.cards.map(card => (
                  <Card
                    key={card._id}
                    card={card}
                    userId={this.state.userId}
                    onLike={this.handleLikeCard}
                    onDelete={this.handleDeleteCardRequest}
                    onImageClick={this.handleImageClick}
                  />
                ))}
              </ul>
            </section>
          </main>
          
          <footer className="footer page__section">
            <p className="footer__copyright">© 2025 Mesto Russia</p>
          </footer>

          {this.state.isEditProfileVisible && (
            <EditProfile
              currentName={this.state.userName}
              currentDescription={this.state.userDescription}
              onClose={this.closeAllPopups}
              onSave={this.handleUpdateUser}
            />
          )}

          {this.state.isAvatarVisible && (
            <Avatar
              onClose={this.closeAllPopups}
              onSave={this.handleUpdateAvatar}
            />
          )}

          {this.state.isAddPlaceVisible && (
            <AddPlacePopup
              onClose={this.closeAllPopups}
              onSave={this.handleAddCard}
            />
          )}

          {this.state.isDeleteConfirmVisible && (
            <DeleteConfirmPopup
              onClose={this.closeAllPopups}
              onConfirm={this.confirmDeleteCard}
            />
          )}

          {this.state.isImageVisible && (
            <div className="popup popup_type_image popup_is-animated popup_is-opened">
              <div className="popup__content popup__content_content_image">
                <button type="button" className="popup__close" onClick={this.closeAllPopups}></button>
                <img src={this.state.selectedImage.src} alt={this.state.selectedImage.caption} className="popup__image" />
                <p className="popup__caption">{this.state.selectedImage.caption}</p>
              </div>
            </div>
          )}

          {this.state.isStatsVisible && (
            <StatsPopup
              cards={this.state.cards}
              userId={this.state.userId}
              userName={this.state.userName}
              userDescription={this.state.userDescription}
              onClose={this.closeAllPopups}
            />
          )}
        </div>
      </div>
    );
  }
}

// Card компонент
interface CardProps {
  card: ICardData;
  userId: string;
  onLike: (card: ICardData) => void;
  onDelete: (card: ICardData) => void;
  onImageClick: (src: string, caption: string) => void;
}

class Card extends React.Component<CardProps> {
  handleLike = () => this.props.onLike(this.props.card);
  handleDelete = () => this.props.onDelete(this.props.card);
  handleImageClick = () => {
    this.props.onImageClick(this.props.card.link, this.props.card.name);
  };

  render() {
    const { card, userId } = this.props;
    const isLiked = card.likes.some(like => like._id === userId);
    const isOwn = card.owner._id === userId;

    return (
      <li className="places__item card">
        <div
          className="card__image"
          style={{ backgroundImage: `url(${card.link})` }}
          onClick={this.handleImageClick}
        ></div>
        {isOwn && (
          <div className="card__control">
            <button className="card__control-button card__control-button_type_delete" onClick={this.handleDelete}></button>
          </div>
        )}
        <div className="card__description">
          <h2 className="card__title">{card.name}</h2>
          <div className="card__likes">
            <button
              className={`card__like-button ${isLiked ? 'card__like-button_is-active' : ''}`}
              onClick={this.handleLike}
            ></button>
            <span className="card__like-count">{card.likes.length}</span>
          </div>
        </div>
      </li>
    );
  }
}

// StatsPopup компонент
interface StatsPopupProps {
  cards: ICardData[];
  userId: string;
  userName: string;
  userDescription: string;
  onClose: () => void;
}

class StatsPopup extends React.Component<StatsPopupProps> {
  render() {
    const { cards, userId, userName, onClose } = this.props;
    
    // Собираем всех пользователей с их лайками
    const usersMap = new Map<string, { name: string; likeCount: number }>();
    usersMap.set(userId, { name: userName, likeCount: 0 });
    
    cards.forEach(card => {
      if (!usersMap.has(card.owner._id)) {
        usersMap.set(card.owner._id, { 
          name: `Пользователь ${card.owner._id.slice(-6)}`, 
          likeCount: 0 
        });
      }
    });
    
    // Считаем лайки для каждого пользователя
    cards.forEach(card => {
      card.likes.forEach(like => {
        const user = usersMap.get(like._id);
        if (user) {
          user.likeCount += 1;
        }
      });
    });
    
    const usersList = Array.from(usersMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.likeCount - a.likeCount);
    
    // Топ карточек по лайкам
    const topCards = [...cards]
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 3);
    
    // Общая статистика
    const totalUsers = usersMap.size;
    const totalLikes = cards.reduce((sum, card) => sum + card.likes.length, 0);
    const maxLikesFromOne = usersList[0]?.likeCount || 0;
    const championName = usersList[0]?.id === userId ? userName : usersList[0]?.name || '-';
    
    return (
      <div className="popup popup_type_info popup_is-animated popup_is-opened">
        <div className="popup__content popup__content_content_info">
          <button type="button" className="popup__close" onClick={onClose}></button>
          <h3 className="popup__title">Статистика карточек</h3>
          
          <dl className="popup__info">
            <div className="popup__info-item">
              <dt className="popup__info-term">Всего пользователей:</dt>
              <dd className="popup__info-description">{totalUsers}</dd>
            </div>
            <div className="popup__info-item">
              <dt className="popup__info-term">Всего лайков:</dt>
              <dd className="popup__info-description">{totalLikes}</dd>
            </div>
            <div className="popup__info-item">
              <dt className="popup__info-term">Максимально лайков от одного:</dt>
              <dd className="popup__info-description">{maxLikesFromOne}</dd>
            </div>
            <div className="popup__info-item">
              <dt className="popup__info-term">Чемпион лайков:</dt>
              <dd className="popup__info-description">{championName}</dd>
            </div>
          </dl>
          
          <h4 className="popup__text">Популярные карточки:</h4>
          <ul className="popup__list">
            {topCards.map(card => (
              <li key={card._id} className="popup__list-item popup__list-item_type_badge">
                {card.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;