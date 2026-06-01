import Swal from "sweetalert2";
import { ReactSweetAlert } from "sweetalert2-react-content";
import { store } from "../feature/store";
import { setPaperPosition } from "../feature/selectedCardSlice";
import moment from "moment";

const allowAlphaNumeric = (e: any) => {
  var keyCode = e.keyCode || e.which;
  var pattern = /^[a-z\d\-_\s]+$/i;
  var isValid = pattern.test(String.fromCharCode(keyCode));
  if (!isValid) {
    e.preventDefault();
  } else {
  }
};
const CustomeComparator = (valueA: any, valueB: any) => { 
  if (valueA == null || valueB == null) return 0; // Handle null/undefined values

  const strA = valueA?.toString()?.trim();
  const strB = valueB?.toString()?.trim();

  if (strA?.toLowerCase() === strB?.toLowerCase()) return 0;
  return strA?.localeCompare(strB);
};
const allowOnlyCharacters = (event: any) => {
  var ASCIICode = event.charCode;
  if (
    (ASCIICode >= 65 && ASCIICode <= 90) ||
    (ASCIICode >= 97 && ASCIICode <= 122) ||
    ASCIICode === 32
  ) {
  } else {
    event.preventDefault();
  }
};

const allowOnlyNumbers = (event: any) => {
  if (event.key.length === 1 && /\D/.test(event.key)) {
    event.preventDefault();
  }
};

const avoidSpace = (event: any) => {
  var ASCIICode = event.charCode;
  if(ASCIICode === 32){
    event.preventDefault();
  }
}
const closeSweetAlertOnBrowserBack = (swal: ((typeof Swal & ReactSweetAlert) | typeof Swal), hasActivityPopoverToggle: boolean) => {
  window.addEventListener('popstate', (event) => {
    event.preventDefault();
    if(swal.isVisible()){
      swal.update({
          hideClass: {
            popup: '',
            backdrop: ''
          }
        });
      swal.close();
    }
    if(hasActivityPopoverToggle){
      document.body.classList.remove("popover-toggle");
    }
  });
}
const CustomeComparatorNumber = (valueA: any, valueB: any) => {
  if (valueA === valueB) return 0;
  return Number(valueA) > Number(valueB) ? 1 : -1;
};

const approvependingAct = (uuid: string, note: string, close: any | null = null) => {
  // let model = {
  //   pendingActivities: [
  //     {
  //       note: note,
  //       uuid: uuid
  //     }
  //   ]
  // }
  // PendingActivityService.approve(model).then(res => {
  //   if (res.status === StatusCode.Success) {
  //     // toast.success("Pending activity was successfully approved");
  //     toast.success(res.data.message);
  //     localStorage.setItem("isPendingStatus", "true");
  //     if(close){
  //       close();
  //     }else{
  //       window.history.back();
  //     }
  //     ChangePendingActState(false);
  //   }
  // }).catch((err) => err?.response?.data?.errors?.map((e: string) => toast.error(e)));
}

const cancelpendingAct = (createdBy: number, uuid: string, note: string, close: any | null = null) => {
  // let model = {
  //   pendingActivities: [
  //     {
  //       note: note,
  //       uuid: uuid
  //     }
  //   ]
  // }
  
  // if (createdBy === JSON.parse(user as string)?.userId) {
  //   //discard
  //   PendingActivityService.discard(model).then(res => {
  //     if (res.status === StatusCode.Success) {
  //       // toast.success("Pending activity was successfully discarded");
        
  //       toast.success(res.data.message);
  //       ChangePendingActState(false);
  //       localStorage.setItem("isPendingStatus", "true");
  //       if(close){
  //         close();
  //       }else{
  //         window.history.back();
  //       }
  //     }
  //   }).catch((err) => err?.response?.data?.errors?.map((e: string) => toast.error(e)));

  // } else {
  //   // reject
  //   PendingActivityService.reject(model).then(res => {
  //     if (res.status === StatusCode.Success) {
  //       // toast.success("Pending activity was successfully rejected");
  //       toast.success(res.data.message);
  //       ChangePendingActState(false);
  //       localStorage.setItem("isPendingStatus", "true");
  //       if(close){
  //         close();
  //       }else{
  //         window.history.back();
  //       }
  //     }
  //   }).catch((err) => err?.response?.data?.errors?.map((e: string) => toast.error(e)));
  // }
}

const compareDate = (valueA: any, valueB: any) => {
  // Check if either value is null or undefined
  if (!valueA || !valueB) return 0;

  // Parse the dates to compare them as date objects
  const dateA = moment(valueA);
  const dateB = moment(valueB);

  // Compare the two dates
  if (dateA.isBefore(dateB)) return -1; // If dateA is before dateB
  if (dateA.isAfter(dateB)) return 1;  // If dateA is after dateB
  return 0;  // If both dates are equal
};

const getValues = (e: any) => {
  if (devicePixelRatio === 1.25) {
    let userAgent = navigator.userAgent;
    var element = e.target.getBoundingClientRect();
    //setTop(status?.top as number);
    if (userAgent.match(/firefox|fxios/i)) {
      store.dispatch(
        setPaperPosition({
          left: element?.left + element?.left * 0.25,
          top: element?.top + element?.top * 0.25,
        })
      );
    } else {
      store.dispatch(
        setPaperPosition({ left: element?.left + element?.left * 0.25, top: element?.top + element?.top * 0.25 })
      );
    }
  }
};
export { allowAlphaNumeric, 
  getValues,
  allowOnlyCharacters,
   allowOnlyNumbers,
    avoidSpace,  
    CustomeComparator,
    closeSweetAlertOnBrowserBack,
  CustomeComparatorNumber,
  approvependingAct,
  cancelpendingAct,
  compareDate,
  
};
