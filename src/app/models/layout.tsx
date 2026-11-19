import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Learning Model Benchmarks: Bi-LSTM, XGBoost & Prophet",
  description:
    "Comparative performance metrics, RMSE, MAE, MAPE, and training characteristics for Bidirectional LSTM, Gradient Boosted Trees, Ridge Regression, and Prophet.",
  alternates: {
    canonical: "/models",
  },
  openGraph: {
    title: "Machine Learning Model Benchmarks | GridForecaster",
    description:
      "Deep benchmarking of Bidirectional LSTM with Attention (1.82% MAPE) vs XGBoost and regulatory baselines for grid net demand forecasting.",
    url: "https://grid-demand-forecast.vercel.app/models",
  },
};

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
