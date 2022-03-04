import Header from '../components/header'

interface Props {
    children: any
}

const RootLayout = (props: Props) => {

    return (
        <>
            <Header />
            {props.children}
        </>
    )
}

export default RootLayout
