


export  const WidgetContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
            {children}
        </div>
    );
};
