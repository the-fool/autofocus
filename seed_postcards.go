package main

import (
	"context"
	"os"
	"fmt"
	"log"
	"cloud.google.com/go/firestore"
)

func main() {
	ctx := context.Background()	

	projectID := os.Getenv("GCLOUD_PROJECT")

	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	pins := client.Collection("Pins")

	type Pin struct {
		X float64 `firestore:"x"`
		Y float64 `firestore:"y"`
		Img string `firestore:"img"`
		Comment string `firestore:"comment"`
	}

	pinData := []Pin{
		Pin {
			X: 0.5,
			Y: 0.5,
			Img: "foo.jpg",
			Comment: "pin 1",
		},
		Pin {
			X: 0.7,
			Y: 0.1,
			Img: "foo2.jpg",
			Comment: "pin 2",
		},
	}

	for i, p := range pinData {
		pinId := fmt.Sprintf("P%d", i)

		pinRef := pins.Doc(pinId)
		
		wr, err := pinRef.Create(ctx, p)
		if err != nil {
			log.Fatalf("Failed to create pin: %v", err)
		}

		fmt.Println(wr)
	}
}