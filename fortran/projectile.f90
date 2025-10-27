program projectile_motion
    implicit none

    real :: v0, angle_deg, angle_rad
    real :: vx, vy, x, y
    real :: g, dt, t
    real :: k, m, ax, ay
    real :: wind
    integer :: ios
    character(len=100) :: input_file, output_file

    input_file = "input.txt"
    output_file = "output.txt"

    g = 9.81
    m = 1.0

    open(unit=10, file=input_file, status="old", action="read", iostat=ios)
    if (ios /= 0) then
        print *, "Error: could not open input.txt"
        stop
    endif
    read(10, *) v0, angle_deg, k, dt, wind
    close(10)

    angle_rad = angle_deg * 3.14159265 / 180.0

    vx = v0 * cos(angle_rad)
    vy = v0 * sin(angle_rad)
    x = 0.0
    y = 0.0
    t = 0.0

    open(unit=20, file=output_file, status="replace", action="write")

    write(20, '(A)') "# t(s)    x(m)    y(m)"


    do while (y >= 0.0)
        write(20, '(F8.3, 2X, F10.3, 2X, F10.3)') t, x, y

        ax = -(k/m) * (vx - wind)  ! relative velocity with wind
        ay = -g - (k/m) * vy

        vx = vx + ax * dt
        vy = vy + ay * dt

        x = x + vx * dt
        y = y + vy * dt

        t = t + dt
    end do

    close(20)

    print *, "Simulation complete. Results written to output.txt"

end program projectile_motion
