FROM python:3-slim AS build-env
ADD *.py /app
WORKDIR /app

# Start production image build
FROM gcr.io/distroless/python3

# Copy node modules and build directory
COPY --from=build-env /app /app
WORKDIR /app
CMD ["python3", "service.py"]
