import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  id: number;
  name: string;
}

interface CardData {
  id: number;
  title: string;
  description: string;
  categories: string[]; // รองรับหลายหมวดหมู่
  dueDate?: string; // Optional due date
}

interface ListData {
  id: number;
  title: string;
  cards: CardData[];
  categories: Category[]; // หมวดหมู่ในแต่ละรายการ
}

interface BoardState {
  lists: ListData[];
}

const initialState: BoardState = {
  lists: [
    { id: 1, title: "To Do", cards: [], categories: [{ id: 1, name: "Work" }] },
    { id: 2, title: "In Progress", cards: [], categories: [{ id: 2, name: "Personal" }] },
    { id: 3, title: "Done", cards: [], categories: [{ id: 3, name: "Urgent" }] },
  ],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addCard(state, action: PayloadAction<{ listId: number; card: CardData }>) {
      const { listId, card } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.cards.push(card);
      }
    },
    editCard(state, action: PayloadAction<{ listId: number; cardId: number; cardData: CardData }>) {
      const { listId, cardId, cardData } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        const cardIndex = list.cards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          list.cards[cardIndex] = { ...list.cards[cardIndex], ...cardData };
        }
      }
    },
    deleteCard(state, action: PayloadAction<{ listId: number; cardId: number }>) {
      const { listId, cardId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.cards = list.cards.filter((card) => card.id !== cardId);
      }
    },
    addCategory(state, action: PayloadAction<{ listId: number; category: Category }>) {
      const { listId, category } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.categories.push(category);
      }
    },
    editCategory(state, action: PayloadAction<{ listId: number; categoryId: number; categoryName: string }>) {
      const { listId, categoryId, categoryName } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        const categoryIndex = list.categories.findIndex((category) => category.id === categoryId);
        if (categoryIndex !== -1) {
          list.categories[categoryIndex].name = categoryName;
        }
      }
    },
    deleteCategory(state, action: PayloadAction<{ listId: number; categoryId: number }>) {
      const { listId, categoryId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.categories = list.categories.filter((category) => category.id !== categoryId);
      }
    },
    // New moveCard action
    moveCard(state, action: PayloadAction<{ sourceListId: number; targetListId: number; cardId: number }>) {
        const { sourceListId, targetListId, cardId } = action.payload;
      
        const sourceList = state.lists.find((list) => list.id === sourceListId);
        const targetList = state.lists.find((list) => list.id === targetListId);
      
        if (sourceList && targetList) {
          // Find the card to move
          const cardIndex = sourceList.cards.findIndex((card) => card.id === cardId);
          
          if (cardIndex !== -1) {
            const [card] = sourceList.cards.splice(cardIndex, 1); // Remove card from source list
            targetList.cards.push(card); // Add card to target list
          }
        }
      },
  },
});

export const {
  addCard,
  editCard,
  deleteCard,
  addCategory,
  editCategory,
  deleteCategory,
  moveCard,
} = boardSlice.actions;

export default boardSlice.reducer;
