type TProps = {
  title: string;
  children: React.ReactNode;
};

export const CommonSection = ({ title, children }: TProps) => (
  <section className="mt-12 w-full">
    <div className="px-16">
      <h3 className="text-center">{title}</h3>
      <div className="mt-10 mb-10">{children}</div>
    </div>
  </section>
);
