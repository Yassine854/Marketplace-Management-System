import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import supplierData from "../../../../data_test.json";

interface ProductRevenueLossChartProps {
  supplierId: string; // Accept supplierId as a prop
}

// Define the type for the chart state
interface ChartState {
  series: { data: number[] }[]; // The series should be an array of objects, each having a 'data' property (array of numbers)
  options: {
    chart: {
      type: "bar"; // Explicitly define the type as 'bar'
      height: number;
    };
    plotOptions: {
      bar: {
        horizontal: boolean;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    xaxis: {
      categories: string[]; // categories should be an array of strings
    };
    annotations: {
      xaxis: {
        x: number;
        borderColor: string;
        label: {
          text: string;
          borderColor: string;
          style: { color: string; background: string };
        };
      }[];
      yaxis: { y: string; y2: string; label: { text: string } }[];
    };
    grid: {
      xaxis: {
        lines: { show: boolean };
      };
    };
    yaxis: {
      reversed: boolean;
      axisTicks: {
        show: boolean;
      };
    };
  };
}

const ProductRevenueLossChart: React.FC<ProductRevenueLossChartProps> = ({
  supplierId,
}) => {
  const [state, setState] = useState<ChartState>({
    series: [{ data: [] }],
    options: {
      chart: {
        type: "bar", // Correctly set the type here as 'bar'
        height: 350,
      },
      annotations: {
        xaxis: [
          {
            x: 500,
            borderColor: "#00E396",
            label: {
              borderColor: "#00E396",
              style: {
                color: "#fff",
                background: "#00E396",
              },
              text: "X annotation",
            },
          },
        ],
        yaxis: [
          {
            y: "July",
            y2: "September",
            label: {
              text: "Y annotation",
            },
          },
        ],
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [],
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      yaxis: {
        reversed: true,
        axisTicks: {
          show: true,
        },
      },
    },
  });

  const [totalRevenueLoss, setTotalRevenueLoss] = useState<number>(0);

  useEffect(() => {
    const revenueLossPerProduct: Record<string, number> = {};
    let totalLoss = 0;

    // Loop through the data and filter based on the supplierId passed as prop
    supplierData.forEach((order) => {
      order.suppliers.forEach((supplier) => {
        if (supplier.manufacturer_id === supplierId) {
          supplier.items.forEach((item) => {
            // Check if there are returns and if any item is marked as 'pending'
            const returnInfo = supplier.returns.find(
              (r) => r.status === "pending" && r.return_id,
            );

            if (returnInfo) {
              // Calculate the lost revenue per item due to the unavailability of the product
              const discountAmount = item.discount?.discount_amount || 0;
              const lossPerProduct =
                item.qty_ordered * (item.price - discountAmount);

              // Add the product's loss to the total
              if (revenueLossPerProduct[item.name]) {
                revenueLossPerProduct[item.name] += lossPerProduct;
              } else {
                revenueLossPerProduct[item.name] = lossPerProduct;
              }
              totalLoss += lossPerProduct;
            }
          });
        }
      });
    });

    // Prepare the chart data (names of products and their respective revenue loss)
    const categories = Object.keys(revenueLossPerProduct);
    const data = categories.map((product) => revenueLossPerProduct[product]);

    // Update the chart state with the data and categories
    setState({
      series: [{ data }],
      options: {
        ...state.options,
        xaxis: {
          categories,
        },
      },
    });

    // Set the total revenue loss
    setTotalRevenueLoss(totalLoss);
  }, [supplierId]); // Re-run the effect if supplierId changes

  return (
    <div className="border-stroke pt-7.5 dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white px-5 pb-5 shadow-default">
      {/* Product Revenue Loss Details */}
      <div className="mt-5">
        <h3 className="mb-3 text-center text-xl font-bold">
          LOSS OF REVENUE BY PRODUCT DUE TO PRODUCT UNAVAILABILITY
        </h3>

        {/* Bar Chart Display */}
        <div id="chart">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="bar" // Ensure the 'type' is properly set
            height={350}
          />
        </div>

        {/* List of Product Losses */}
        <ul className="mt-5">
          {state.options.xaxis.categories.map((product, index) => (
            <li key={index} className="flex justify-between">
              <span>{product}</span>
              <span>{`$${state.series[0].data[index].toFixed(2)}`}</span>
            </li>
          ))}
        </ul>

        {/* Total Loss */}
        <div className="mt-4 text-right text-xl font-semibold">
          <span>Total Revenue Loss: </span>
          <span>{`$${totalRevenueLoss.toFixed(2)}`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductRevenueLossChart;
