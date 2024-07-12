import React, { useEffect, useState } from "react";
//import useStyles from "./styles";
//import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
//import { selectOrderOnMap, hoverOrderOnMap } from "../../redux/actions/orders";
//import { useDispatch, useSelector } from "react-redux";
//import { Card, Typography } from "@material-ui/core";

export const selectOrderOnMap = (selectedOrder: any) => {
  //   return (dispatch) => {
  //     const ordersState = store.getState().ordersReducer;
  //     let orders = JSON.parse(JSON.stringify(ordersState.ordersByDate));
  //     const orderIndex = orders.findIndex(
  //       (item) => item.order_id === selectedOrder.order_id,
  //     );
  //     orders[orderIndex].selected = !orders[orderIndex].selected;
  //     dispatch({ type: SELECT_ORDER_ON_MAP, orders });
  //   };
};
export const hoverOrderOnMap = (hoveredOrder: any, openWindow: any) => {
  //   return (dispatch) => {
  //     const ordersState = store.getState().ordersReducer;
  //     let orders = JSON.parse(JSON.stringify(ordersState.ordersByDate));
  //     const orderIndex = orders.findIndex(
  //       (item) => item.order_id === hoveredOrder.order_id,
  //     );
  //     orders[orderIndex].hovered = openWindow;
  //     dispatch({ type: SELECT_ORDER_ON_MAP, orders });
  //   };
};
const MilRunMap = () => {
  const [showWindow, setShowWindow] = useState(false);

  const onMarkerClic = (item: any) => {
    //   dispatch(selectOrderOnMap(item));
  };

  const onMarkerHover = (item: any) => {
    // dispatch(hoverOrderOnMap(item, true));
  };

  const closeMarkerWindow = (item: any) => {
    //  dispatch(hoverOrderOnMap(item, false));
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div>
        {/* <Card className={classes.card}>
          <Typography className={classes.cardText}>
            {`Total Orders: ${
              ordersState.ordersByDate && ordersState.ordersByDate.length
            }`}
          </Typography>
        </Card>
        <Card className={classes.card}>
          <Typography className={classes.cardText}>
            {`Selected Orders: ${
              ordersState.ordersByDate &&
              ordersState.ordersByDate.filter((item) => item.selected === true)
                .length
            }`}
          </Typography>
        </Card> */}
      </div>
      <GoogleMap
        defaultZoom={11}
        defaultCenter={{ lat: 36.70972, lng: 10.174644 }}
        defaultOptions={{ mapTypeControl: false }}
      >
        {/* {ordersState.ordersByDate &&
          ordersState.ordersByDate.map((item: any) => {
            return (
              <Marker
                key={item.order_id}
                position={{ lat: item.latitude, lng: item.longitude }}
                clickable
                options={{
                  icon: item.selected
                    ? "https://api.geoapify.com/v1/icon/?type=material&color=%23ffffff&size=large&apiKey=906ef766f6574a5987e8bc990d68cdd3"
                    : item.icon,
                }}
                onMouseOver={() => {
                  onMarkerHover(item);
                }}
                onMouseOut={() => {
                  closeMarkerWindow(item);
                }}
                onClick={() => {
                  onMarkerClic(item);
                }}
              >
                {item.hovered ? (
                  <InfoWindow
                    onCloseClick={() => {
                      closeMarkerWindow(item);
                    }}
                    position={{
                      lat: item.latitude,
                      lng: item.longitude,
                    }}
                  >
                    <div>
                      <p className={classes.infoWindowTitle}>
                        Tech_ID #{item.order_id}
                      </p>
                      <p className={classes.infoWindowTitle}>
                        Order #{item.kamioun_order_id}
                      </p>
                      <p className={classes.infoWindowTitle}>{item.name}</p>
                      <p className={classes.infoWindowPrice}>
                        {item.order_amount?.toFixed(3)} DT
                      </p>
                      {item.delivery_agent.length > 0 ? (
                        <p className={classes.infoWindowPrice}>
                          Agent: {item.delivery_agent}
                        </p>
                      ) : null}
                    </div>
                  </InfoWindow>
                ) : null}
              </Marker>
            );
          })} */}
        {/* <Marker
          position={{ lat: 36.70972, lng: 10.174644 }}
          clickable
          options={{
            icon: "https://api.geoapify.com/v1/icon/?type=material&color=%23003366&size=large&apiKey=906ef766f6574a5987e8bc990d68cdd3",
          }}
          onMouseOver={() => {
            setShowWindow(true);
          }}
          onMouseOut={() => {
            setShowWindow(false);
          }}
        >
          {showWindow ? (
            <InfoWindow
              onCloseClick={() => {
                setShowWindow(false);
              }}
              position={{
                lat: 36.70972,
                lng: 10.174644,
              }}
            >
              <div>
                <p>Warehouse</p>
              </div>
            </InfoWindow>
          ) : null}
        </Marker> */}
      </GoogleMap>
    </div>
  );
};

// compose(
//   withProps({
//     googleMapURL:
//       "https://maps.googleapis.com/maps/api/js?key=AIzaSyAWaI2ljSKHUjYYC0bzJq9syLZAETUviWk&v=3.exp&libraries=geometry,drawing,places",
//     loadingElement: <div style={{ height: `100%` }} />,
//     containerElement: <div style={{ height: `75vh` }} />,
//     mapElement: <div style={{ height: `100%` }} />,
//   }),
//   withScriptjs,
//   withGoogleMap,
// )((props) => {
//   let classes = useStyles();
//   const dispatch = useDispatch();
//   const ordersState = useSelector((state) => state).ordersReducer;
//   const [showWindow, setShowWindow] = useState(false);

//   const onMarkerClic = (item) => {
//     dispatch(selectOrderOnMap(item));
//   };

//   const onMarkerHover = (item) => {
//     dispatch(hoverOrderOnMap(item, true));
//   };

//   const closeMarkerWindow = (item) => {
//     dispatch(hoverOrderOnMap(item, false));
//   };

// });

export default MilRunMap;
