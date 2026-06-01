import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface cardNum {
  cardNum?: string;
  cardId?: number;
}

interface customerId {
  customerId?: number;
}

interface paperPosition {
  left: number;
  top: number;
}

export interface cardState {
  customerId: customerId;
  value: cardNum;
  // value1?: CardInformation;
  position: paperPosition;
  selectedLimitInst: number;
  searchTextUser: string;
  unreadNotification: number;
  disableHeaderOption: boolean;
  hyperlinkType: string;
}

const initialState: cardState = {
  customerId: {
    customerId: 21,
  },
  value: {
    cardNum: "",
  },
  searchTextUser: "",
  unreadNotification: 0,
  selectedLimitInst:0,
  position: {
    left: 0,
    top: 0,
  },
  disableHeaderOption: false,
  hyperlinkType: localStorage.getItem("hyperLinkType") ?? ""
};

// export const getValues = (e: any) => {
//     //const dispatch = useDispatch();
//     var element = e.target.getBoundingClientRect();
//     //setTop(status?.top as number);
//     store.dispatch(setPaperPosition({left: element?.left, top: element?.top}))
//     //setLeft(element?.left);
//   }

export const CardInfo = createSlice({
  name: "cardInfo",
  initialState,
  reducers: {
    selectedCard: (state, action: PayloadAction<cardNum>) => {
      state.value = action.payload;
    },
    setHyperLinkType: (state, action: PayloadAction<string>) => {
      state.hyperlinkType = action.payload;
    },
    selectedLimitInst: (state, action: PayloadAction<number>) => {
       state.selectedLimitInst = action.payload;
    },
    selectedCustomer: (state, action: PayloadAction<customerId>) => {
       state.customerId = action.payload;
    },
    // selectedCardDetails: (state, action: PayloadAction<CardInformation>) => {
    //   state.value1 = action.payload;
    // },
    setPaperPosition: (state, action: PayloadAction<paperPosition>) => {
      state.position = action.payload;
    },
    setSearchTextUser: (state, action: PayloadAction<string>) => {
      state.searchTextUser = action.payload;
    },
    setNotifications: (state, action: PayloadAction<number>) => {
      state.unreadNotification = action.payload;
    },
    setDisableHeaderOption: (state, action: PayloadAction<boolean>) => {
       state.disableHeaderOption = action.payload;
    }
  },
});

export const { selectedCard, selectedCustomer, setPaperPosition, selectedLimitInst, setSearchTextUser, setNotifications, setDisableHeaderOption, setHyperLinkType } = CardInfo.actions;

export default CardInfo.reducer;
