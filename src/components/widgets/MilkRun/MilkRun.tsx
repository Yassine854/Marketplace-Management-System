import Banner from "../Banner";
import Box from "../../Layouts/Box";
const OrderDetails = () => {
  return (
    <Box>
      <Banner title="Manage Milk Run" />
      <div className="col-span-12 flex flex-grow lg:col-span-7 xl:col-span-8">
        <div className="box h-full w-full overflow-hidden ">
          {/* <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
            <p className="font-medium">Map</p>
            <OptionsVertical />
          </div> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3115.580229411125!2d10.175987615341832!3d36.80649537993854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a58577b028abd1%3A0x1eab679e8f28ec33!2sTunis%2C%20Tunisia!5e0!3m2!1sen!2sus!4v1699267521891!5m2!1sen!2sus"
            width="100%"
            style={{ border: "0", borderRadius: "16px", minHeight: "350px" }}
            allowFullScreen={true}
            loading="lazy"
            className="h-[95%] lg:h-[96.5%]"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </Box>
  );
};
export default OrderDetails;
