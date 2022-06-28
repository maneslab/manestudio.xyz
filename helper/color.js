export const getColorList = (number)   => {
    let default_color_list = [
        '#9f7ce8',
        '#EA8EF4',
        '#C0C0C0',
        '#92E4D1',
        '#7091E6',
        '#35AA88',
        '#EFDB8B',
        '#F5A79D',
        '#BDDCFC'
    ];

    if (number <= default_color_list.length) {
        return default_color_list.slice(0,number);
    }else {
        let color_list = default_color_list;
        for (let i = 0; i < number - default_color_list.length; i++) {
            let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            color_list.push(color);
        }
        return color_list;
    }
}